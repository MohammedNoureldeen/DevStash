import { notFound, redirect } from 'next/navigation'
import { auth } from '@/src/auth'
import DashboardShell from '@/src/components/dashboard/DashboardShell'
import ItemsListContent from '@/src/components/items/ItemsListContent'
import { getItemsByTypeName, getItemTypesWithCounts } from '@/src/lib/db/items'
import { getFavoriteCollections, getRecentCollections, getCollectionsForSelect } from '@/src/lib/db/collections'

const PLURAL_TO_SINGULAR: Record<string, string> = {
  snippets: 'snippet',
  prompts: 'prompt',
  notes: 'note',
  commands: 'command',
  links: 'link',
  files: 'file',
  images: 'image',
}

export default async function ItemsTypePage({
  params,
}: {
  params: Promise<{ type: string }>
}) {
  const { type } = await params
  const typeName = PLURAL_TO_SINGULAR[type]
  if (!typeName) notFound()

  const session = await auth()
  if (!session?.user?.id) redirect('/sign-in')
  const userId = session.user.id

  const [items, itemTypes, favoriteCollections, recentCollections, selectCollections] =
    await Promise.all([
      getItemsByTypeName(typeName),
      getItemTypesWithCounts(),
      getFavoriteCollections(userId),
      getRecentCollections(userId, 3),
      getCollectionsForSelect(userId),
    ])

  const typeMetadata = itemTypes.find(t => t.name === typeName)
  if (!typeMetadata) notFound()

  return (
    <DashboardShell
      sidebarData={{ itemTypes, favoriteCollections, recentCollections }}
      user={session.user}
      collections={selectCollections}
    >
      <ItemsListContent
        items={items}
        typeLabel={type}
        typeColor={typeMetadata.color}
        collections={selectCollections}
      />
    </DashboardShell>
  )
}
