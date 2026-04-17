import { prisma } from '@/src/lib/prisma'

export type ItemWithType = {
  id: string
  title: string
  description: string | null
  contentType: string
  content: string | null
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
