'use client'

import { useState, useEffect } from 'react'
import {
  Sheet,
  SheetContent,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import {
  Star, Pin, Copy, Pencil, Trash2, X, Check,
  Code, Sparkles, StickyNote, Terminal,
  Link as LinkIcon, File, Image,
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

function Skeleton({ className }: { className?: string }) {
  return <div className={`rounded-md bg-muted animate-pulse ${className ?? ''}`} />
}

function DrawerSkeleton() {
  return (
    <div className="flex flex-col gap-5 p-5">
      <div className="flex items-start gap-3">
        <Skeleton className="w-10 h-10 shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-12" />
        <Skeleton className="h-6 w-20" />
      </div>
      <Skeleton className="h-32 w-full" />
    </div>
  )
}

export default function ItemDrawer({
  open,
  itemId,
  onClose,
}: {
  open: boolean
  itemId: string | null
  onClose: () => void
}) {
  const [item, setItem] = useState<ItemWithType | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!itemId) return
    setLoading(true)
    setItem(null)
    fetch(`/api/items/${itemId}`)
      .then(res => res.json())
      .then((data: ItemWithType) => {
        setItem(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [itemId])

  function handleCopy() {
    if (!item?.content) return
    navigator.clipboard.writeText(item.content).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const Icon = item ? (ICON_MAP[item.itemType.icon] ?? File) : File

  return (
    <Sheet open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose() }}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-full sm:max-w-[520px] p-0 flex flex-col gap-0"
      >
        {/* Action bar */}
        <div className="flex items-center justify-between border-b border-border px-3 py-2.5 shrink-0">
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon-sm"
              title="Favorite"
              className={item?.isFavorite ? 'text-amber-400' : ''}
            >
              <Star className={item?.isFavorite ? 'fill-amber-400' : ''} />
            </Button>
            <Button variant="ghost" size="icon-sm" title="Pin">
              <Pin className={item?.isPinned ? 'fill-primary text-primary' : ''} />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              title={copied ? 'Copied!' : 'Copy content'}
              onClick={handleCopy}
              disabled={!item?.content}
            >
              {copied ? <Check className="text-emerald-400" /> : <Copy />}
            </Button>
            <Button variant="ghost" size="icon-sm" title="Edit">
              <Pencil />
            </Button>
          </div>
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon-sm"
              title="Delete"
              className="text-destructive hover:text-destructive"
            >
              <Trash2 />
            </Button>
            <Button variant="ghost" size="icon-sm" title="Close" onClick={onClose}>
              <X />
            </Button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <DrawerSkeleton />
          ) : item ? (
            <div className="flex flex-col gap-5 p-5">
              {/* Header: icon + title + type */}
              <div className="flex items-start gap-3">
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0 mt-0.5"
                  style={{ backgroundColor: `${item.itemType.color}15` }}
                >
                  <Icon className="h-5 w-5" style={{ color: item.itemType.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-foreground leading-tight break-words">
                    {item.title}
                  </h2>
                  <span
                    className="text-xs font-medium capitalize mt-1 inline-block"
                    style={{ color: item.itemType.color }}
                  >
                    {item.itemType.name}
                  </span>
                </div>
              </div>

              {/* Description */}
              {item.description && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              )}

              {/* Tags */}
              {item.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {item.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded-md bg-secondary text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Content */}
              {item.content && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                    Content
                  </p>
                  <div className="rounded-lg bg-muted/50 border border-border p-3 overflow-x-auto">
                    <pre className="text-sm text-foreground whitespace-pre-wrap break-words font-mono">
                      {item.content}
                    </pre>
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="border-t border-border pt-4 flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Created</span>
                  <span>
                    {new Date(item.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                {item.lastUsedAt && (
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Last used</span>
                    <span>
                      {new Date(item.lastUsedAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  )
}
