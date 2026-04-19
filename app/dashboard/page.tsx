import DashboardShell from '@/src/components/dashboard/DashboardShell'
import MainContent from '@/src/components/dashboard/MainContent'
import { getRecentCollections, getFavoriteCollections } from '@/src/lib/db/collections'
import { getDashboardStats, getPinnedItems, getRecentItems, getItemTypesWithCounts } from '@/src/lib/db/items'
import { auth } from '@/src/auth'

export default async function DashboardPage() {
  const [session, collections, pinnedItems, recentItems, stats, itemTypes, favoriteCollections] =
    await Promise.all([
      auth(),
      getRecentCollections(6),
      getPinnedItems(),
      getRecentItems(10),
      getDashboardStats(),
      getItemTypesWithCounts(),
      getFavoriteCollections(),
    ])

  return (
    <DashboardShell
      sidebarData={{ itemTypes, favoriteCollections, recentCollections: collections.slice(0, 3) }}
      user={session?.user ?? null}
    >
      <MainContent
        collections={collections}
        pinnedItems={pinnedItems}
        recentItems={recentItems}
        stats={stats}
      />
    </DashboardShell>
  )
}
