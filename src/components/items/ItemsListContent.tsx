'use client'

import { useState } from 'react'
import {
  Code, Sparkles, StickyNote, Terminal,
  Link as LinkIcon, File, FileText, Image,
  Star, Download,
} from 'lucide-react'
import type { ItemWithType } from '@/src/lib/db/items'
import ItemDrawer from './ItemDrawer'

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

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const TEXT_EXTENSIONS = new Set(['pdf', 'doc', 'docx', 'txt', 'rtf', 'md', 'csv', 'log'])

function getFileIcon(fileName: string | null): React.ElementType {
  if (!fileName) return File
  const ext = fileName.split('.').pop()?.toLowerCase() ?? ''
  return TEXT_EXTENSIONS.has(ext) ? FileText : File
}

function FileListRow({ item, onClick }: { item: ItemWithType; onClick: () => void }) {
  const FileIcon = getFileIcon(item.fileName)
  const fileProxyUrl = item.fileUrl ? `/api/files/${item.fileUrl}` : null

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-secondary/50 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-secondary shrink-0">
        <FileIcon className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium text-foreground truncate">
            {item.fileName ?? item.title}
          </span>
          {item.isFavorite && <Star className="h-3.5 w-3.5 shrink-0 text-amber-400 fill-amber-400" />}
        </div>
        {item.description && (
          <p className="text-xs text-muted-foreground truncate mt-0.5">{item.description}</p>
        )}
        <div className="flex items-center gap-2 mt-0.5 sm:hidden text-xs text-muted-foreground">
          {item.fileSize != null && <span>{formatBytes(item.fileSize)}</span>}
          {item.fileSize != null && <span>·</span>}
          <span>{formatDate(item.createdAt)}</span>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-6 text-sm text-muted-foreground shrink-0">
        {item.fileSize != null && (
          <span className="w-16 text-right">{formatBytes(item.fileSize)}</span>
        )}
        <span className="w-20 text-right">{formatDate(item.createdAt)}</span>
      </div>

      {fileProxyUrl && (
        <a
          href={fileProxyUrl}
          download={item.fileName ?? true}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors shrink-0"
        >
          <Download className="h-4 w-4" />
        </a>
      )}
    </div>
  )
}

function ItemCard({ item, onClick }: { item: ItemWithType; onClick: () => void }) {
  const Icon = ICON_MAP[item.itemType.icon] ?? File

  return (
    <div
      className="glass-card hover-lift rounded-xl p-4 cursor-pointer group border-l-4"
      style={{ borderLeftColor: item.itemType.color }}
      onClick={onClick}
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

function ImageThumbnailCard({ item, onClick }: { item: ItemWithType; onClick: () => void }) {
  return (
    <div
      className="glass-card rounded-xl overflow-hidden cursor-pointer group"
      onClick={onClick}
    >
      <div className="aspect-video overflow-hidden bg-secondary">
        {item.fileUrl ? (
          <img
            src={`/api/files/${item.fileUrl}`}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Image className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="p-3">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-foreground truncate">{item.title}</span>
          {item.isFavorite && <Star className="h-3.5 w-3.5 shrink-0 text-amber-400 fill-amber-400" />}
        </div>
        {item.description && (
          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{item.description}</p>
        )}
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
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const isImageGallery = typeLabel === 'images'
  const isFileList = typeLabel === 'files'

  return (
    <>
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
        ) : isImageGallery ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map(item => (
              <ImageThumbnailCard
                key={item.id}
                item={item}
                onClick={() => setSelectedItemId(item.id)}
              />
            ))}
          </div>
        ) : isFileList ? (
          <div className="glass-card rounded-xl overflow-hidden divide-y divide-border">
            {items.map(item => (
              <FileListRow
                key={item.id}
                item={item}
                onClick={() => setSelectedItemId(item.id)}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map(item => (
              <ItemCard
                key={item.id}
                item={item}
                onClick={() => setSelectedItemId(item.id)}
              />
            ))}
          </div>
        )}
      </div>

      <ItemDrawer
        open={!!selectedItemId}
        itemId={selectedItemId}
        onClose={() => setSelectedItemId(null)}
      />
    </>
  )
}
