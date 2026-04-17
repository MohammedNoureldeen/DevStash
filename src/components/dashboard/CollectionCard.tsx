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
      className="group relative rounded-xl border-0 bg-gradient-card p-5 card-lift cursor-pointer overflow-hidden"
      style={{ 
        boxShadow: `inset 4px 0 0 0 ${collection.borderColor}, var(--shadow-sm)`
      }}
    >
      {/* Subtle gradient overlay */}
      <div 
        className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"
        style={{ 
          background: `linear-gradient(135deg, ${collection.borderColor}08 0%, transparent 50%)` 
        }}
      />

      {/* Header with name and menu */}
      <div className="relative flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-base font-bold text-foreground truncate tracking-tight">
            {collection.name}
          </span>
          {collection.isFavorite && (
            <Star className="h-4 w-4 shrink-0 text-amber-500 fill-amber-500" />
          )}
        </div>
        <button
          className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-1.5 rounded-lg hover:bg-muted/80"
          aria-label="More options"
        >
          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Item count */}
      <p className="relative text-sm font-medium text-muted-foreground mt-2">
        {collection.itemCount} {collection.itemCount === 1 ? 'item' : 'items'}
      </p>

      {/* Description */}
      {collection.description && (
        <p className="relative text-sm text-muted-foreground line-clamp-2 mt-2 leading-relaxed">
          {collection.description}
        </p>
      )}

      {/* Type icons at bottom */}
      {collection.typeIcons.length > 0 && (
        <div className="relative flex items-center gap-1.5 mt-4 pt-3 border-t border-border/40">
          {collection.typeIcons.slice(0, 5).map((type, i) => {
            const Icon = ICON_MAP[type.icon] ?? File
            return (
              <div
                key={i}
                className="flex items-center justify-center w-7 h-7 rounded-lg transition-transform duration-200 hover:scale-110"
                style={{ backgroundColor: `${type.color}18` }}
              >
                <Icon className="h-3.5 w-3.5" style={{ color: type.color }} />
              </div>
            )
          })}
          {collection.typeIcons.length > 5 && (
            <span className="text-xs font-semibold text-muted-foreground ml-1">
              +{collection.typeIcons.length - 5}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
