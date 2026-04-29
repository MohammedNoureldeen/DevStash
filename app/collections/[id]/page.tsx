import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { auth } from '@/src/auth'
import DashboardShell from '@/src/components/dashboard/DashboardShell'
import ItemsListContent from '@/src/components/items/ItemsListContent'
import CollectionDetailActions from '@/src/components/collections/CollectionDetailActions'
import { getCollectionById, getFavoriteCollections, getRecentCollections, getCollectionsForSelect } from '@/src/lib/db/collections'
import { getItemTypesWithCounts } from '@/src/lib/db/items'

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const session = await auth()
  if (!session?.user?.id) redirect('/sign-in')
  const userId = session.user.id

  const [collection, itemTypes, favoriteCollections, recentCollections, selectCollections] = await Promise.all([
    getCollectionById(id, userId),
    getItemTypesWithCounts(),
    getFavoriteCollections(userId),
    getRecentCollections(userId, 3),
    getCollectionsForSelect(userId),
  ])
  if (!collection) notFound()

  return (
    <DashboardShell
      sidebarData={{ itemTypes, favoriteCollections, recentCollections }}
      user={session.user}
      collections={selectCollections}
    >
      <div className="flex flex-col gap-6">
        <div>
          <Link
            href="/collections"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
          >
            <ArrowLeft className="h-4 w-4" />
            Collections
          </Link>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{collection.name}</h1>
              {collection.description && (
                <p className="text-muted-foreground mt-1">{collection.description}</p>
              )}
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span
                className="text-xs font-medium px-2.5 py-1 rounded-full"
                style={{ backgroundColor: `${collection.borderColor}18`, color: collection.borderColor }}
              >
                {collection.itemCount} {collection.itemCount === 1 ? 'item' : 'items'}
              </span>
              <CollectionDetailActions
                collection={{
                  id: collection.id,
                  name: collection.name,
                  description: collection.description,
                  isFavorite: collection.isFavorite,
                  itemCount: collection.itemCount,
                  borderColor: collection.borderColor,
                }}
              />
            </div>
          </div>
        </div>

        <ItemsListContent
          items={collection.items}
          typeLabel={collection.name}
          typeColor={collection.borderColor}
          collections={selectCollections}
        />
      </div>
    </DashboardShell>
  )
}
