import Link from 'next/link'
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
  gradient,
  iconColor,
}: {
  label: string
  value: number
  icon: React.ElementType
  gradient: string
  iconColor: string
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl p-5 card-lift cursor-pointer">
      {/* Gradient background */}
      <div 
        className="absolute inset-0 opacity-10 transition-opacity duration-300 group-hover:opacity-15"
        style={{ background: gradient }}
      />
      
      {/* Border with gradient tint */}
      <div 
        className="absolute inset-0 rounded-xl border-2 transition-colors duration-300 group-hover:border-opacity-30"
        style={{ borderColor: `${iconColor}30` }}
      />
      
      {/* Content */}
      <div className="relative flex items-center gap-4">
        <div
          className="flex items-center justify-center w-12 h-12 rounded-xl shrink-0 shadow-md transition-transform duration-300 group-hover:scale-105"
          style={{ background: gradient }}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-3xl font-bold text-foreground tabular-nums tracking-tight">{value}</p>
          <p className="text-sm font-medium text-muted-foreground mt-0.5">{label}</p>
        </div>
      </div>
    </div>
  )
}

function PinnedItemCard({ item }: { item: ItemWithType }) {
  const Icon = ICON_MAP[item.itemType.icon] ?? File

  return (
    <div className="group rounded-xl border border-border/60 bg-gradient-card p-5 card-lift cursor-pointer">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div 
            className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0 transition-transform duration-300 group-hover:scale-110"
            style={{ backgroundColor: `${item.itemType.color}15` }}
          >
            <Icon className="h-4 w-4" style={{ color: item.itemType.color }} />
          </div>
          <span className="text-base font-semibold text-foreground truncate">{item.title}</span>
        </div>
        <Pin className="h-4 w-4 shrink-0 text-muted-foreground/60 transition-colors group-hover:text-primary" />
      </div>
      {item.description && (
        <p className="text-sm text-muted-foreground line-clamp-2 mt-3 leading-relaxed">{item.description}</p>
      )}
      {item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-border/40">
          {item.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="inline-flex items-center rounded-lg bg-muted/80 px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted"
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
    <div className="flex items-center gap-4 py-3.5 px-4 rounded-xl transition-all duration-200 cursor-pointer group interactive-hover hover:bg-muted/60">
      <div
        className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:shadow-md"
        style={{ backgroundColor: `${item.itemType.color}18` }}
      >
        <Icon className="h-4 w-4" style={{ color: item.itemType.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{item.title}</p>
        {item.description && (
          <p className="text-xs text-muted-foreground truncate mt-0.5">{item.description}</p>
        )}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {item.tags.slice(0, 2).map(tag => (
          <span
            key={tag}
            className="hidden sm:inline-flex items-center rounded-lg bg-muted/80 px-2 py-0.5 text-xs font-medium text-muted-foreground"
          >
            {tag}
          </span>
        ))}
        {item.isFavorite && <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />}
        <span className="text-xs text-muted-foreground font-medium">{formatDate(item.createdAt)}</span>
      </div>
    </div>
  )
}

function SectionHeader({ 
  icon: Icon, 
  title, 
  action 
}: { 
  icon: React.ElementType
  title: string
  action?: { label: string; href: string }
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2.5">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-bold text-foreground tracking-tight">{title}</h2>
      </div>
      {action && (
        <Link 
          href={action.href} 
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          {action.label}
        </Link>
      )}
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
    <div className="flex flex-col gap-8">

      {/* Stats */}
      <section>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard 
            label="Total Items" 
            value={stats.totalItems} 
            icon={Layers} 
            gradient="linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)"
            iconColor="#3b82f6"
          />
          <StatCard 
            label="Collections" 
            value={stats.totalCollections} 
            icon={FolderOpen} 
            gradient="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%)"
            iconColor="#8b5cf6"
          />
          <StatCard 
            label="Favorites" 
            value={stats.favoriteItems} 
            icon={Star} 
            gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)"
            iconColor="#f59e0b"
          />
          <StatCard 
            label="Saved Collections" 
            value={stats.favoriteCollections} 
            icon={BookMarked} 
            gradient="linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)"
            iconColor="#10b981"
          />
        </div>
      </section>

      {/* Collections */}
      <section>
        <SectionHeader 
          icon={FolderOpen} 
          title="Collections" 
          action={{ label: 'View all', href: '/collections' }}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map(col => (
            <CollectionCard key={col.id} collection={col} />
          ))}
        </div>
        <Link 
          href="/collections" 
          className="mt-4 block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors text-center"
        >
          View all collections
        </Link>
      </section>

      {/* Pinned Items */}
      {pinnedItems.length > 0 && (
        <section>
          <SectionHeader 
            icon={Pin} 
            title="Pinned Items" 
          />
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
          <SectionHeader 
            icon={Clock} 
            title="Recent Items" 
          />
          <div className="rounded-2xl border border-border/60 bg-card shadow-elevation-sm overflow-hidden divide-y divide-border/40">
            {recentItems.map(item => (
              <RecentItemRow key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

    </div>
  )
}
