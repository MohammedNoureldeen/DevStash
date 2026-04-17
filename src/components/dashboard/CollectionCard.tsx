import { Star, MoreHorizontal, ArrowUpRight } from 'lucide-react'
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
    <div className="glass-card hover-lift rounded-xl p-5 cursor-pointer group relative overflow-hidden">
      {/* Accent Line */}
      <div 
        className="absolute top-0 left-0 right-0 h-1"
        style={{ backgroundColor: collection.borderColor }}
      />
      
      {/* Content */}
      <div className="pt-2">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <h3 className="text-base font-semibold text-foreground truncate">{collection.name}</h3>
            {collection.isFavorite && (
              <Star className="h-4 w-4 shrink-0 text-amber-400 fill-amber-400" />
            )}
          </div>
          <button
            className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground"
            aria-label="More options"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>

        {/* Item count */}
        <p className="text-sm text-muted-foreground mt-1">
          {collection.itemCount} {collection.itemCount === 1 ? 'item' : 'items'}
        </p>

        {/* Description */}
        {collection.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-3">{collection.description}</p>
        )}

        {/* Type icons & Action */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          {collection.typeIcons.length > 0 ? (
            <div className="flex items-center gap-1">
              {collection.typeIcons.slice(0, 4).map((type, i) => {
                const Icon = ICON_MAP[type.icon] ?? File
                return (
                  <div 
                    key={i} 
                    className="flex items-center justify-center w-7 h-7 rounded-md"
                    style={{ backgroundColor: `${type.color}12` }}
                  >
                    <Icon className="h-3.5 w-3.5" style={{ color: type.color }} />
                  </div>
                )
              })}
              {collection.typeIcons.length > 4 && (
                <span className="text-xs text-muted-foreground ml-1">+{collection.typeIcons.length - 4}</span>
              )}
            </div>
          ) : (
            <div />
          )}
          
          {/* Open Link */}
          <div className="flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
            <span>Open</span>
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  )
}
