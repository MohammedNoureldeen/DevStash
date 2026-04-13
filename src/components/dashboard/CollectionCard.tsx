import { Star, MoreHorizontal } from 'lucide-react'
import { Code, Sparkles, StickyNote, Terminal, Link as LinkIcon, File, Image } from 'lucide-react'
import type { CollectionWithDetails } from '@/src/lib/db/collections'

const ICON_MAP: Record<string, React.ElementType> = {
  Code,
  Sparkles,
  StickyNote,
  Terminal,
  Link: LinkIcon,
  File,
  Image,
}

export default function CollectionCard({ collection }: { collection: CollectionWithDetails }) {
  return (
    <div
      className="rounded-lg border bg-card p-4 flex flex-col gap-2 hover:border-border/80 transition-colors cursor-pointer group"
      style={{ borderLeftWidth: '3px', borderLeftColor: collection.borderColor }}
    >
      {/* Header with name and menu */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-medium text-foreground truncate">{collection.name}</span>
          {collection.isFavorite && <Star className="h-3 w-3 shrink-0 text-yellow-500" />}
        </div>
        <button
          className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-muted"
          aria-label="More options"
        >
          <MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </div>

      {/* Item count */}
      <p className="text-xs text-muted-foreground">
        {collection.itemCount} {collection.itemCount === 1 ? 'item' : 'items'}
      </p>

      {/* Description */}
      {collection.description && (
        <p className="text-xs text-muted-foreground line-clamp-2">{collection.description}</p>
      )}

      {/* Type icons at bottom */}
      {collection.typeIcons.length > 0 && (
        <div className="flex items-center gap-1 mt-auto pt-1">
          {collection.typeIcons.slice(0, 5).map((type, i) => {
            const Icon = ICON_MAP[type.icon] ?? File
            return (
              <div
                key={i}
                className="flex items-center justify-center w-5 h-5 rounded"
                style={{ backgroundColor: `${type.color}22` }}
              >
                <Icon className="h-3 w-3" style={{ color: type.color }} />
              </div>
            )
          })}
          {collection.typeIcons.length > 5 && (
            <span className="text-xs text-muted-foreground">+{collection.typeIcons.length - 5}</span>
          )}
        </div>
      )}
    </div>
  )
}
