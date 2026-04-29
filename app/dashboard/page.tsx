import { redirect } from 'next/navigation'
import DashboardShell from '@/src/components/dashboard/DashboardShell'
import MainContent from '@/src/components/dashboard/MainContent'
import { getRecentCollections, getFavoriteCollections, getCollectionsForSelect } from '@/src/lib/db/collections'
import { getDashboardStats, getPinnedItems, getRecentItems, getItemTypesWithCounts } from '@/src/lib/db/items'
import { auth } from '@/src/auth'

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/sign-in')
  const userId = session.user.id

  const [collections, pinnedItems, recentItems, stats, itemTypes, favoriteCollections, selectCollections] =
    await Promise.all([
      getRecentCollections(userId, 6),
      getPinnedItems(),
      getRecentItems(10),
      getDashboardStats(),
      getItemTypesWithCounts(),
      getFavoriteCollections(userId),
      getCollectionsForSelect(userId),
    ])

  return (
    <DashboardShell
      sidebarData={{ itemTypes, favoriteCollections, recentCollections: collections.slice(0, 3) }}
      user={session.user}
      collections={selectCollections}
    >
      <MainContent
        collections={collections}
        pinnedItems={pinnedItems}
        recentItems={recentItems}
        stats={stats}
        availableCollections={selectCollections}
      />
    </DashboardShell>
  )
}
