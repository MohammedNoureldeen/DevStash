import { prisma } from '@/src/lib/prisma'

export type ItemWithType = {
  id: string
  title: string
  description: string | null
  contentType: string
  content: string | null
  url: string | null
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
}

export type UpdateItemData = {
  title: string
  description: string | null
  content: string | null
  url: string | null
  language: string | null
  tags: string[]
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

function mapItem(item: {
  id: string
  title: string
  description: string | null
  contentType: string
  content: string | null
  url: string | null
  language: string | null
  isFavorite: boolean
  isPinned: boolean
  createdAt: Date
  lastUsedAt: Date | null
  itemType: { id: string; name: string; icon: string; color: string }
  tags: { tag: { name: string } }[]
}): ItemWithType {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    contentType: item.contentType,
    content: item.content,
    url: item.url,
    language: item.language,
    isFavorite: item.isFavorite,
    isPinned: item.isPinned,
    createdAt: item.createdAt,
    lastUsedAt: item.lastUsedAt,
    itemType: item.itemType,
    tags: item.tags.map((t) => t.tag.name),
  }
}

export async function getPinnedItems(): Promise<ItemWithType[]> {
  const items = await prisma.item.findMany({
    where: { isPinned: true },
    orderBy: { updatedAt: 'desc' },
    include: itemWithTypeInclude,
  })
  return items.map(mapItem)
}

export async function getRecentItems(limit = 10): Promise<ItemWithType[]> {
  const items = await prisma.item.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: itemWithTypeInclude,
  })
  return items.map(mapItem)
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
  return items.map(mapItem)
}

export async function getItemById(id: string, userId: string): Promise<ItemWithType | null> {
  const item = await prisma.item.findFirst({
    where: { id, userId },
    include: itemWithTypeInclude,
  })
  if (!item) return null
  return mapItem(item)
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
