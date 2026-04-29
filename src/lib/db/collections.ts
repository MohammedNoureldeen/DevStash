import { prisma } from '@/src/lib/prisma'
import type { ItemWithType } from './items'

export type CreateCollectionData = {
  name: string
  description?: string | null
}

export type UpdateCollectionData = {
  name?: string
  description?: string | null
}

export type FavoriteCollection = {
  id: string
  name: string
}

export type CollectionWithDetails = {
  id: string
  name: string
  description: string | null
  isFavorite: boolean
  createdAt: Date
  updatedAt: Date
  itemCount: number
  typeIcons: {
    icon: string
    color: string
  }[]
  borderColor: string
}

export type CollectionDetail = CollectionWithDetails & {
  items: ItemWithType[]
}

type RawCollection = {
  id: string
  name: string
  description: string | null
  isFavorite: boolean
  createdAt: Date
  updatedAt: Date
  items: {
    item: {
      itemType: { id: string; icon: string; color: string }
    }
  }[]
}

function mapCollection(col: RawCollection): CollectionWithDetails {
  const typeCount: Record<string, { icon: string; color: string; count: number }> = {}

  for (const itemCol of col.items) {
    const type = itemCol.item.itemType
    if (!typeCount[type.id]) {
      typeCount[type.id] = { icon: type.icon, color: type.color, count: 0 }
    }
    typeCount[type.id].count += 1
  }

  const sortedTypes = Object.entries(typeCount).sort((a, b) => b[1].count - a[1].count)
  const borderColor = sortedTypes.length > 0 ? sortedTypes[0][1].color : '#3b82f6'
  const typeIcons = sortedTypes.map(([, data]) => ({ icon: data.icon, color: data.color }))

  return {
    id: col.id,
    name: col.name,
    description: col.description,
    isFavorite: col.isFavorite,
    createdAt: col.createdAt,
    updatedAt: col.updatedAt,
    itemCount: col.items.length,
    typeIcons,
    borderColor,
  }
}

export async function createCollection(
  userId: string,
  data: CreateCollectionData,
): Promise<CollectionWithDetails> {
  const col = await prisma.collection.create({
    data: {
      name: data.name,
      description: data.description ?? null,
      userId,
    },
    include: {
      items: {
        include: {
          item: {
            include: { itemType: true },
          },
        },
      },
    },
  })
  return mapCollection(col)
}

export async function getRecentCollections(userId: string, limit = 6): Promise<CollectionWithDetails[]> {
  const collections = await prisma.collection.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      items: {
        include: {
          item: {
            include: {
              itemType: true,
            },
          },
        },
      },
    },
  })
  return collections.map(mapCollection)
}

export async function getFavoriteCollections(userId: string): Promise<FavoriteCollection[]> {
  return prisma.collection.findMany({
    where: { isFavorite: true, userId },
    orderBy: { updatedAt: 'desc' },
    select: { id: true, name: true },
  })
}

export async function getCollectionsForSelect(
  userId: string,
): Promise<{ id: string; name: string }[]> {
  return prisma.collection.findMany({
    where: { userId },
    orderBy: { name: 'asc' },
    select: { id: true, name: true },
  })
}

const collectionItemsInclude = {
  items: {
    include: {
      item: {
        include: {
          itemType: true,
          tags: { include: { tag: true } },
        },
      },
    },
  },
} as const

export async function getAllCollections(userId: string): Promise<CollectionWithDetails[]> {
  const collections = await prisma.collection.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    include: collectionItemsInclude,
  })
  return collections.map(mapCollection)
}

export async function getCollectionById(id: string, userId: string): Promise<CollectionDetail | null> {
  const col = await prisma.collection.findFirst({
    where: { id, userId },
    include: collectionItemsInclude,
  })
  if (!col) return null

  const base = mapCollection(col)
  const items: ItemWithType[] = col.items.map(({ item }) => ({
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
    collections: [],
  }))

  return { ...base, items }
}

export async function updateCollection(
  id: string,
  userId: string,
  data: UpdateCollectionData,
): Promise<CollectionWithDetails | null> {
  const col = await prisma.collection.update({
    where: { id, userId },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.description !== undefined && { description: data.description }),
    },
    include: {
      items: {
        include: {
          item: {
            include: { itemType: true },
          },
        },
      },
    },
  })
  return mapCollection(col)
}

export async function deleteCollection(
  id: string,
  userId: string,
): Promise<boolean> {
  const result = await prisma.collection.deleteMany({
    where: { id, userId },
  })
  return result.count > 0
}

export async function toggleFavoriteCollection(
  id: string,
  userId: string,
): Promise<CollectionWithDetails | null> {
  const current = await prisma.collection.findFirst({
    where: { id, userId },
    select: { isFavorite: true },
  })
  if (!current) return null

  const col = await prisma.collection.update({
    where: { id },
    data: { isFavorite: !current.isFavorite },
    include: {
      items: {
        include: {
          item: {
            include: { itemType: true },
          },
        },
      },
    },
  })
  return mapCollection(col)
}
