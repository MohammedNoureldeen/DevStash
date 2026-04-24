import {
  Code, Sparkles, StickyNote, Terminal,
  Link as LinkIcon, File, Image,
  Star,
} from 'lucide-react'
import type { ItemWithType } from '@/src/lib/db/items'

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

function ItemCard({ item }: { item: ItemWithType }) {
  const Icon = ICON_MAP[item.itemType.icon] ?? File

  return (
    <div
      className="glass-card hover-lift rounded-xl p-4 cursor-pointer group border-l-4"
      style={{ borderLeftColor: item.itemType.color }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0"
          style={{ backgroundColor: `${item.itemType.color}15` }}
        >
          <Icon className="h-4 w-4" style={{ color: item.itemType.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground truncate">{item.title}</span>
            {item.isFavorite && <Star className="h-3.5 w-3.5 shrink-0 text-amber-400 fill-amber-400" />}
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
          <p className="text-xs text-muted-foreground mt-3">{formatDate(item.createdAt)}</p>
        </div>
      </div>
    </div>
  )
}

export default function ItemsListContent({
  items,
  typeLabel,
  typeColor,
}: {
  items: ItemWithType[]
  typeLabel: string
  typeColor: string
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground capitalize">{typeLabel}</h1>
        <p className="text-muted-foreground mt-1" style={{ color: typeColor }}>
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <p className="text-muted-foreground">No {typeLabel.toLowerCase()} yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
