import DashboardShell from '@/src/components/dashboard/DashboardShell'
import MainContent from '@/src/components/dashboard/MainContent'
import { getRecentCollections, getFavoriteCollections, getCollectionsForSelect } from '@/src/lib/db/collections'
import { getDashboardStats, getPinnedItems, getRecentItems, getItemTypesWithCounts } from '@/src/lib/db/items'
import { auth } from '@/src/auth'

export default async function DashboardPage() {
  const session = await auth()
  const userId = session?.user?.id

  const [collections, pinnedItems, recentItems, stats, itemTypes, favoriteCollections, selectCollections] =
    await Promise.all([
      getRecentCollections(6),
      getPinnedItems(),
      getRecentItems(10),
      getDashboardStats(),
      getItemTypesWithCounts(),
      getFavoriteCollections(),
      userId ? getCollectionsForSelect(userId) : Promise.resolve([]),
    ])

  return (
    <DashboardShell
      sidebarData={{ itemTypes, favoriteCollections, recentCollections: collections.slice(0, 3) }}
      user={session?.user ?? null}
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
