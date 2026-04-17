import Link from 'next/link'
import {
  Code, Sparkles, StickyNote, Terminal,
  Link as LinkIcon, File, Image,
  Star, Pin, Clock,
  Layers, BookMarked, FolderOpen,
  TrendingUp,
} from 'lucide-react'
import type { CollectionWithDetails } from '@/src/lib/db/collections'
import type { DashboardStats, ItemWithType } from '@/src/lib/db/items'
import CollectionCard from './CollectionCard'

const ICON_MAP: Record<string, React.ElementType> = {
  Code,
  Sparkles,
  StickyNote,
  Terminal,
  Link: LinkIcon,
  File,
  Image,
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function StatCard({
  label,
  value,
  icon: Icon,
  trend,
}: {
  label: string
  value: number
  icon: React.ElementType
  trend?: string
}) {
  return (
    <div className="glass-card hover-lift rounded-xl p-5 cursor-pointer group">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground tracking-tight">{value.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
            <TrendingUp className="h-3 w-3" />
            {trend}
          </div>
        )}
      </div>
    </div>
  )
}

function PinnedItemCard({ item }: { item: ItemWithType }) {
  const Icon = ICON_MAP[item.itemType.icon] ?? File

  return (
    <div className="glass-card hover-lift rounded-xl p-4 cursor-pointer group">
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0" style={{ backgroundColor: `${item.itemType.color}15` }}>
          <Icon className="h-4 w-4" style={{ color: item.itemType.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground truncate">{item.title}</span>
            <Pin className="h-3 w-3 shrink-0 text-primary" />
          </div>
          {item.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{item.description}</p>
          )}
          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {item.tags.slice(0, 3).map(tag => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded-md bg-secondary text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function RecentItemRow({ item }: { item: ItemWithType }) {
  const Icon = ICON_MAP[item.itemType.icon] ?? File

  return (
    <div className="flex items-center gap-3 py-3 px-4 rounded-lg cursor-pointer transition-all duration-200 hover:bg-secondary/50 group">
      <div className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-transform group-hover:scale-105" style={{ backgroundColor: `${item.itemType.color}12` }}>
        <Icon className="h-4 w-4" style={{ color: item.itemType.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
        {item.description && (
          <p className="text-xs text-muted-foreground truncate mt-0.5">{item.description}</p>
        )}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {item.tags.slice(0, 2).map(tag => (
          <span key={tag} className="hidden sm:inline text-xs px-2 py-0.5 rounded-md bg-secondary text-muted-foreground">
            {tag}
          </span>
        ))}
        {item.isFavorite && <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />}
        <span className="text-xs text-muted-foreground font-medium">{formatDate(item.createdAt)}</span>
      </div>
    </div>
  )
}

function SectionHeader({ title, action }: { title: string; action?: { label: string; href: string } }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="section-title">{title}</h2>
      {action && (
        <Link href={action.href} className="text-sm font-medium text-primary hover:text-primary-hover transition-colors">
          {action.label}
        </Link>
      )}
    </div>
  )
}

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
    <div className="flex flex-col gap-8">

      {/* Welcome */}
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage and organize your development resources</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Items" value={stats.totalItems} icon={Layers} trend="+12%" />
        <StatCard label="Collections" value={stats.totalCollections} icon={FolderOpen} trend="+5%" />
        <StatCard label="Favorites" value={stats.favoriteItems} icon={Star} />
        <StatCard label="Saved" value={stats.favoriteCollections} icon={BookMarked} />
      </div>

      {/* Collections */}
      <section>
        <SectionHeader title="Collections" action={{ label: 'View all', href: '/collections' }} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map(col => (
            <CollectionCard key={col.id} collection={col} />
          ))}
        </div>
      </section>

      {/* Pinned Items */}
      {pinnedItems.length > 0 && (
        <section>
          <SectionHeader title="Pinned Items" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pinnedItems.map(item => (
              <PinnedItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Recent Items */}
      {recentItems.length > 0 && (
        <section>
          <SectionHeader title="Recent Activity" />
          <div className="glass-card rounded-xl overflow-hidden">
            {recentItems.map((item, idx) => (
              <div key={item.id} className={idx !== recentItems.length - 1 ? 'border-b border-border' : ''}>
                <RecentItemRow item={item} />
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  )
}
