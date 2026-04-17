import {
  Code, Sparkles, StickyNote, Terminal,
  Link as LinkIcon, File, Image,
  Star, Pin, Clock,
  Layers, BookMarked, FolderOpen,
} from 'lucide-react'
import type { CollectionWithDetails } from '@/src/lib/db/collections'
import type { DashboardStats, ItemWithType } from '@/src/lib/db/items'
import CollectionCard from './CollectionCard'

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

// ── Helpers ────────────────────────────────────────────────────────────────
function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
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

function PinnedItemCard({ item }: { item: ItemWithType }) {
  const Icon = ICON_MAP[item.itemType.icon] ?? File

  return (
    <div className="rounded-lg border border-border bg-card p-4 flex flex-col gap-2 hover:border-border/80 transition-colors cursor-pointer">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Icon className="h-4 w-4 shrink-0" style={{ color: item.itemType.color }} />
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

function RecentItemRow({ item }: { item: ItemWithType }) {
  const Icon = ICON_MAP[item.itemType.icon] ?? File

  return (
    <div className="flex items-center gap-3 py-2.5 px-3 rounded-md hover:bg-muted/50 transition-colors cursor-pointer group">
      <div
        className="flex items-center justify-center w-7 h-7 rounded-md shrink-0"
        style={{ backgroundColor: `${item.itemType.color}22` }}
      >
        <Icon className="h-3.5 w-3.5" style={{ color: item.itemType.color }} />
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
export default function MainContent({
  collections,
  pinnedItems,
  recentItems,
  stats,
}: {
  collections: CollectionWithDetails[]
  pinnedItems: ItemWithType[]
  recentItems: ItemWithType[]
  stats: DashboardStats
}) {
  return (
    <div className="flex flex-col gap-6">

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Items"          value={stats.totalItems}          icon={Layers}     color="#3b82f6" />
        <StatCard label="Collections"          value={stats.totalCollections}     icon={FolderOpen} color="#8b5cf6" />
        <StatCard label="Favorite Items"       value={stats.favoriteItems}        icon={Star}       color="#f59e0b" />
        <StatCard label="Favorite Collections" value={stats.favoriteCollections}  icon={BookMarked} color="#10b981" />
      </div>

      {/* Collections */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">Collections</h2>
          </div>
          <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            View all
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {collections.map(col => (
            <CollectionCard key={col.id} collection={col} />
          ))}
        </div>
      </section>

      {/* Pinned Items — hidden when none exist */}
      {pinnedItems.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Pin className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">Pinned Items</h2>
          </div>
          <div className="flex flex-col gap-2">
            {pinnedItems.map(item => (
              <PinnedItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Recent Items */}
      {recentItems.length > 0 && (
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
      )}

    </div>
  )
}
