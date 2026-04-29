import { prisma } from '@/src/lib/prisma'
import type { ContentType } from '@/generated/prisma/client'

export type ItemWithType = {
  id: string
  title: string
  description: string | null
  contentType: string
  content: string | null
  url: string | null
  fileUrl: string | null
  fileName: string | null
  fileSize: number | null
  language: string | null
  isFavorite: boolean
  isPinned: boolean
  createdAt: Date
  lastUsedAt: Date | null
  itemType: {
    id: string
    name: string
    icon: string
    color: string
  }
  tags: string[]
  collections: { id: string; name: string }[]
}

export type CreateItemData = {
  title: string
  description: string | null
  contentType: ContentType
  content: string | null
  url: string | null
  fileUrl: string | null
  fileName: string | null
  fileSize: number | null
  language: string | null
  itemTypeId: string
  tags: string[]
  collectionIds: string[]
}

export type UpdateItemData = {
  title: string
  description: string | null
  content: string | null
  url: string | null
  language: string | null
  tags: string[]
  collectionIds: string[]
}

export type DashboardStats = {
  totalItems: number
  totalCollections: number
  favoriteItems: number
  favoriteCollections: number
}

const itemWithTypeInclude = {
  itemType: true,
  tags: { include: { tag: true } },
} as const

function mapItem(
  item: {
    id: string
    title: string
    description: string | null
    contentType: string
    content: string | null
    url: string | null
    fileUrl: string | null
    fileName: string | null
    fileSize: number | null
    language: string | null
    isFavorite: boolean
    isPinned: boolean
    createdAt: Date
    lastUsedAt: Date | null
    itemType: { id: string; name: string; icon: string; color: string }
    tags: { tag: { name: string } }[]
  },
  collections: { id: string; name: string }[] = [],
): ItemWithType {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    contentType: item.contentType,
    content: item.content,
    url: item.url,
    fileUrl: item.fileUrl,
    fileName: item.fileName,
    fileSize: item.fileSize,
    language: item.language,
    isFavorite: item.isFavorite,
    isPinned: item.isPinned,
    createdAt: item.createdAt,
    lastUsedAt: item.lastUsedAt,
    itemType: item.itemType,
    tags: item.tags.map((t) => t.tag.name),
    collections,
  }
}

export async function getPinnedItems(): Promise<ItemWithType[]> {
  const items = await prisma.item.findMany({
    where: { isPinned: true },
    orderBy: { updatedAt: 'desc' },
    include: itemWithTypeInclude,
  })
  return items.map((item) => mapItem(item))
}

export async function getRecentItems(limit = 10): Promise<ItemWithType[]> {
  const items = await prisma.item.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: itemWithTypeInclude,
  })
  return items.map((item) => mapItem(item))
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [totalItems, totalCollections, favoriteItems, favoriteCollections] =
    await Promise.all([
      prisma.item.count(),
      prisma.collection.count(),
      prisma.item.count({ where: { isFavorite: true } }),
      prisma.collection.count({ where: { isFavorite: true } }),
    ])

  return { totalItems, totalCollections, favoriteItems, favoriteCollections }
}

export type ItemTypeWithCount = {
  id: string
  name: string
  icon: string
  color: string
  isSystem: boolean
  count: number
}

const SYSTEM_TYPE_ORDER = ['snippet', 'prompt', 'command', 'note', 'file', 'image', 'link'] as const

export async function getItemsByTypeName(typeName: string): Promise<ItemWithType[]> {
  const items = await prisma.item.findMany({
    where: { itemType: { name: typeName } },
    orderBy: { updatedAt: 'desc' },
    include: itemWithTypeInclude,
  })
  return items.map((item) => mapItem(item))
}

export async function getItemById(id: string, userId: string): Promise<ItemWithType | null> {
  const item = await prisma.item.findFirst({
    where: { id, userId },
    include: {
      ...itemWithTypeInclude,
      collections: {
        include: { collection: { select: { id: true, name: true } } },
      },
    },
  })
  if (!item) return null
  return mapItem(item, item.collections.map((c) => c.collection))
}

export async function updateItem(
  id: string,
  userId: string,
  data: UpdateItemData,
): Promise<ItemWithType> {
  const item = await prisma.item.update({
    where: { id, userId },
    data: {
      title: data.title,
      description: data.description,
      content: data.content,
      url: data.url,
      language: data.language,
      tags: {
        deleteMany: {},
        create: data.tags.map((tagName) => ({
          tag: {
            connectOrCreate: {
              where: { name: tagName },
              create: { name: tagName },
            },
          },
        })),
      },
      collections: {
        deleteMany: {},
        create: data.collectionIds.map((collectionId) => ({ collectionId })),
      },
    },
    include: itemWithTypeInclude,
  })
  return mapItem(item)
}

export async function deleteItem(id: string, userId: string): Promise<void> {
  await prisma.item.delete({ where: { id, userId } })
}

export async function getItemTypeByName(name: string): Promise<{ id: string } | null> {
  return prisma.itemType.findFirst({
    where: { name, isSystem: true },
    select: { id: true },
  })
}

export async function createItem(userId: string, data: CreateItemData): Promise<ItemWithType> {
  const item = await prisma.item.create({
    data: {
      title: data.title,
      description: data.description,
      contentType: data.contentType,
      content: data.content,
      url: data.url,
      fileUrl: data.fileUrl,
      fileName: data.fileName,
      fileSize: data.fileSize,
      language: data.language,
      userId,
      itemTypeId: data.itemTypeId,
      tags: {
        create: data.tags.map((tagName) => ({
          tag: {
            connectOrCreate: {
              where: { name: tagName },
              create: { name: tagName },
            },
          },
        })),
      },
      collections: {
        create: data.collectionIds.map((collectionId) => ({ collectionId })),
      },
    },
    include: itemWithTypeInclude,
  })
  return mapItem(item)
}

export async function getItemTypesWithCounts(): Promise<ItemTypeWithCount[]> {
  const types = await prisma.itemType.findMany({
    where: { name: { in: [...SYSTEM_TYPE_ORDER] } },
    include: {
      _count: { select: { items: true } },
    },
  })
  return SYSTEM_TYPE_ORDER
    .map(name => types.find(t => t.name === name))
    .filter((t): t is NonNullable<typeof t> => t != null)
    .map(t => ({
      id: t.id,
      name: t.name,
      icon: t.icon,
      color: t.color,
      isSystem: t.isSystem,
      count: t._count.items,
    }))
}
