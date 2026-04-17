import DashboardShell from '@/src/components/dashboard/DashboardShell'
import MainContent from '@/src/components/dashboard/MainContent'
import { getRecentCollections, getFavoriteCollections } from '@/src/lib/db/collections'
import { getDashboardStats, getPinnedItems, getRecentItems, getItemTypesWithCounts } from '@/src/lib/db/items'

export default async function DashboardPage() {
  const [collections, pinnedItems, recentItems, stats, itemTypes, favoriteCollections] =
    await Promise.all([
      getRecentCollections(6),
      getPinnedItems(),
      getRecentItems(10),
      getDashboardStats(),
      getItemTypesWithCounts(),
      getFavoriteCollections(),
    ])

  return (
    <DashboardShell sidebarData={{ itemTypes, favoriteCollections, recentCollections: collections.slice(0, 3) }}>
      <MainContent
        collections={collections}
        pinnedItems={pinnedItems}
        recentItems={recentItems}
        stats={stats}
      />
    </DashboardShell>
  )
}
