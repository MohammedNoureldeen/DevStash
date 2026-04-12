import {
  Code, Sparkles, StickyNote, Terminal,
  Link as LinkIcon, File, Image,
  Star, Pin, Clock, FolderOpen,
  Layers, BookMarked,
} from 'lucide-react'
import {
  mockCollections,
  mockItems,
  mockItemTypes,
  mockItemTypeCounts,
} from '@/src/lib/mock-data'

// ── Icon map ───────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, React.ElementType> = {
  Code,
  Sparkles,
  StickyNote,
  Terminal,
  Link: LinkIcon,
  File,
  Image,
}

// ── Derived data ───────────────────────────────────────────────────────────
const totalItems = Object.values(mockItemTypeCounts).reduce((a, b) => a + b, 0)
const totalCollections = mockCollections.length
const favoriteItemsCount = mockItems.filter(i => i.isFavorite).length
const favoriteCollectionsCount = mockCollections.filter(c => c.isFavorite).length

const pinnedItems = mockItems.filter(i => i.isPinned)

const recentCollections = [...mockCollections]
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  .slice(0, 4)

const recentItems = [...mockItems]
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  .slice(0, 10)

// ── Helpers ────────────────────────────────────────────────────────────────
function getItemType(itemTypeId: string) {
  return mockItemTypes.find(t => t.id === itemTypeId)
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// ── Sub-components ─────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string
  value: number
  icon: React.ElementType
  color: string
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 flex items-center gap-4">
      <div
        className="flex items-center justify-center w-10 h-10 rounded-md shrink-0"
        style={{ backgroundColor: `${color}22` }}
      >
        <Icon className="h-5 w-5" style={{ color }} />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold text-foreground tabular-nums">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      </div>
    </div>
  )
}

function PinnedItemCard({ item }: { item: typeof mockItems[number] }) {
  const type = getItemType(item.itemTypeId)
  const Icon = type ? (ICON_MAP[type.icon] ?? File) : File

  return (
    <div className="rounded-lg border border-border bg-card p-4 flex flex-col gap-2 hover:border-border/80 transition-colors cursor-pointer">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {type && (
            <Icon className="h-4 w-4 shrink-0" style={{ color: type.color }} />
          )}
          <span className="text-sm font-medium text-foreground truncate">{item.title}</span>
        </div>
        <Pin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      </div>
      {item.description && (
        <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
      )}
      {item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-auto pt-1">
          {item.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="inline-flex items-center rounded-md bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function RecentCollectionCard({ col }: { col: typeof mockCollections[number] }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 flex flex-col gap-1.5 hover:border-border/80 transition-colors cursor-pointer">
      <div className="flex items-center gap-2">
        <FolderOpen className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground truncate">{col.name}</span>
        {col.isFavorite && <Star className="h-3 w-3 shrink-0 text-yellow-500 ml-auto" />}
      </div>
      {col.description && (
        <p className="text-xs text-muted-foreground line-clamp-1">{col.description}</p>
      )}
      <p className="text-xs text-muted-foreground mt-auto">
        {col.itemCount} {col.itemCount === 1 ? 'item' : 'items'}
      </p>
    </div>
  )
}

function RecentItemRow({ item }: { item: typeof mockItems[number] }) {
  const type = getItemType(item.itemTypeId)
  const Icon = type ? (ICON_MAP[type.icon] ?? File) : File

  return (
    <div className="flex items-center gap-3 py-2.5 px-3 rounded-md hover:bg-muted/50 transition-colors cursor-pointer group">
      <div
        className="flex items-center justify-center w-7 h-7 rounded-md shrink-0"
        style={{ backgroundColor: type ? `${type.color}22` : undefined }}
      >
        <Icon className="h-3.5 w-3.5" style={{ color: type?.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
        {item.description && (
          <p className="text-xs text-muted-foreground truncate">{item.description}</p>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {item.tags.slice(0, 2).map(tag => (
          <span
            key={tag}
            className="hidden sm:inline-flex items-center rounded-md bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
          >
            {tag}
          </span>
        ))}
        {item.isFavorite && <Star className="h-3 w-3 text-yellow-500" />}
        <span className="text-xs text-muted-foreground">{formatDate(item.createdAt)}</span>
      </div>
    </div>
  )
}

// ── Main export ────────────────────────────────────────────────────────────
export default function MainContent() {
  return (
    <div className="flex flex-col gap-6">

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Items" value={totalItems} icon={Layers} color="#3b82f6" />
        <StatCard label="Collections" value={totalCollections} icon={FolderOpen} color="#8b5cf6" />
        <StatCard label="Favorite Items" value={favoriteItemsCount} icon={Star} color="#f59e0b" />
        <StatCard label="Favorite Collections" value={favoriteCollectionsCount} icon={BookMarked} color="#10b981" />
      </div>

      {/* Pinned + Recent Collections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Pinned Items */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Pin className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">Pinned Items</h2>
          </div>
          {pinnedItems.length > 0 ? (
            <div className="flex flex-col gap-2">
              {pinnedItems.map(item => (
                <PinnedItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No pinned items.</p>
          )}
        </section>

        {/* Recent Collections */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">Recent Collections</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {recentCollections.map(col => (
              <RecentCollectionCard key={col.id} col={col} />
            ))}
          </div>
        </section>

      </div>

      {/* Recent Items */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">Recent Items</h2>
        </div>
        <div className="rounded-lg border border-border bg-card divide-y divide-border overflow-hidden">
          {recentItems.map(item => (
            <RecentItemRow key={item.id} item={item} />
          ))}
        </div>
      </section>

    </div>
  )
}
