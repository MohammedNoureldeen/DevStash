import { prisma } from '@/src/lib/prisma'

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

export async function getRecentCollections(limit = 6): Promise<CollectionWithDetails[]> {
  const collections = await prisma.collection.findMany({
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

export async function getFavoriteCollections(): Promise<FavoriteCollection[]> {
  return prisma.collection.findMany({
    where: { isFavorite: true },
    orderBy: { updatedAt: 'desc' },
    select: { id: true, name: true },
  })
}
