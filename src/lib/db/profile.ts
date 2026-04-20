import { prisma } from '@/src/lib/prisma'

export type ProfileData = {
  id: string
  name: string | null
  email: string
  image: string | null
  createdAt: Date
  isOAuthUser: boolean
}

export type ProfileStats = {
  totalItems: number
  totalCollections: number
  itemTypeBreakdown: { name: string; icon: string; color: string; count: number }[]
}

const SYSTEM_TYPE_ORDER = ['snippet', 'prompt', 'command', 'note', 'file', 'image', 'link'] as const

export async function getProfileData(userId: string): Promise<ProfileData | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
      accounts: { select: { provider: true }, take: 1 },
    },
  })

  if (!user) return null

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    createdAt: user.createdAt,
    isOAuthUser: user.accounts.length > 0,
  }
}

export async function getProfileStats(userId: string): Promise<ProfileStats> {
  const [totalItems, totalCollections, itemTypes] = await Promise.all([
    prisma.item.count({ where: { userId } }),
    prisma.collection.count({ where: { userId } }),
    prisma.itemType.findMany({
      where: { name: { in: [...SYSTEM_TYPE_ORDER] } },
      include: { _count: { select: { items: { where: { userId } } } } },
    }),
  ])

  const breakdown = SYSTEM_TYPE_ORDER
    .map(name => itemTypes.find(t => t.name === name))
    .filter((t): t is NonNullable<typeof t> => t != null)
    .map(t => ({
      name: t.name,
      icon: t.icon,
      color: t.color,
      count: t._count.items,
    }))

  return { totalItems, totalCollections, itemTypeBreakdown: breakdown }
}
