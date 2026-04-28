import { notFound, redirect } from 'next/navigation'
import { auth } from '@/src/auth'
import DashboardShell from '@/src/components/dashboard/DashboardShell'
import ItemsListContent from '@/src/components/items/ItemsListContent'
import { getCollectionById, getFavoriteCollections, getRecentCollections } from '@/src/lib/db/collections'
import { getItemTypesWithCounts } from '@/src/lib/db/items'

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [session, collection, itemTypes, favoriteCollections, recentCollections] = await Promise.all([
    auth(),
    getCollectionById(id),
    getItemTypesWithCounts(),
    getFavoriteCollections(),
    getRecentCollections(3),
  ])

  if (!session) redirect('/sign-in')
  if (!collection) notFound()

  return (
    <DashboardShell
      sidebarData={{ itemTypes, favoriteCollections, recentCollections }}
      user={session.user ?? null}
    >
      <ItemsListContent
        items={collection.items}
        typeLabel={collection.name}
        typeColor={collection.borderColor}
      />
    </DashboardShell>
  )
}
