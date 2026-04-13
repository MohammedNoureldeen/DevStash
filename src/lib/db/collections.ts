import { prisma } from '@/src/lib/prisma'

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

/**
 * Fetch recent collections with their item count and type icons.
 * Border color is derived from the most-used item type in the collection.
 */
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

  return collections.map((col) => {
    // Count items by type to find the most-used type
    const typeCount: Record<string, { icon: string; color: string; count: number }> = {}

    for (const itemCol of col.items) {
      const type = itemCol.item.itemType
      if (!typeCount[type.id]) {
        typeCount[type.id] = { icon: type.icon, color: type.color, count: 0 }
      }
      typeCount[type.id].count += 1
    }

    // Sort types by count descending
    const sortedTypes = Object.entries(typeCount).sort((a, b) => b[1].count - a[1].count)

    // Border color from most-used type, default blue if none
    const borderColor = sortedTypes.length > 0 ? sortedTypes[0][1].color : '#3b82f6'

    // Build type icons array (unique types in this collection)
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
  })
}
