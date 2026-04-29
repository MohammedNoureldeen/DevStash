import { redirect } from 'next/navigation'
import { auth } from '@/src/auth'
import DashboardShell from '@/src/components/dashboard/DashboardShell'
import CollectionCard from '@/src/components/dashboard/CollectionCard'
import { getAllCollections, getFavoriteCollections, getRecentCollections } from '@/src/lib/db/collections'
import { getItemTypesWithCounts } from '@/src/lib/db/items'

export default async function CollectionsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/sign-in')
  const userId = session.user.id

  const [collections, itemTypes, favoriteCollections, recentCollections] = await Promise.all([
    getAllCollections(userId),
    getItemTypesWithCounts(),
    getFavoriteCollections(userId),
    getRecentCollections(userId, 3),
  ])

  return (
    <DashboardShell
      sidebarData={{ itemTypes, favoriteCollections, recentCollections }}
      user={session.user}
    >
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Collections</h1>
          <p className="text-muted-foreground mt-1">
            {collections.length} {collections.length === 1 ? 'collection' : 'collections'}
          </p>
        </div>

        {collections.length === 0 ? (
          <div className="glass-card rounded-xl p-12 text-center">
            <p className="text-muted-foreground">No collections yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {collections.map(col => (
              <CollectionCard key={col.id} collection={col} />
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
