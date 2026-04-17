import DashboardShell from '@/src/components/dashboard/DashboardShell'
import MainContent from '@/src/components/dashboard/MainContent'
import { getRecentCollections } from '@/src/lib/db/collections'
import { getDashboardStats, getPinnedItems, getRecentItems } from '@/src/lib/db/items'

export default async function DashboardPage() {
  const [collections, pinnedItems, recentItems, stats] = await Promise.all([
    getRecentCollections(6),
    getPinnedItems(),
    getRecentItems(10),
    getDashboardStats(),
  ])

  return (
    <DashboardShell>
      <MainContent
        collections={collections}
        pinnedItems={pinnedItems}
        recentItems={recentItems}
        stats={stats}
      />
    </DashboardShell>
  )
}
