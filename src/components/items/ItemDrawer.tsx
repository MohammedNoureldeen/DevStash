'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  Sheet,
  SheetContent,
} from '@/components/ui/sheet'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Star, Pin, Copy, Pencil, Trash2, X, Check, Download,
  Code, Sparkles, StickyNote, Terminal,
  Link as LinkIcon, File, Image,
} from 'lucide-react'
import NextImage from 'next/image'
import type { ItemWithType } from '@/src/lib/db/items'
import { updateItem } from '@/src/actions/items'
import CodeEditor from '@/src/components/ui/CodeEditor'
import MarkdownEditor from '@/src/components/ui/MarkdownEditor'

const ICON_MAP: Record<string, React.ElementType> = {
  Code,
  Sparkles,
  StickyNote,
  Terminal,
  Link: LinkIcon,
  File,
  Image,
}

const CONTENT_TYPES = new Set(['snippet', 'prompt', 'command', 'note'])
const LANGUAGE_TYPES = new Set(['snippet', 'command'])
const CODE_TYPES = new Set(['snippet', 'command'])
const MARKDOWN_TYPES = new Set(['note', 'prompt'])
const UPLOAD_TYPES = new Set(['file', 'image'])

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
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

type EditForm = {
  title: string
  description: string
  tags: string
  content: string
  language: string
  url: string
}

function formFromItem(item: ItemWithType): EditForm {
  return {
    title: item.title,
    description: item.description ?? '',
    tags: item.tags.join(', '),
    content: item.content ?? '',
    language: item.language ?? '',
    url: item.url ?? '',
  }
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
  const router = useRouter()
  const [item, setItem] = useState<ItemWithType | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [form, setForm] = useState<EditForm>({
    title: '',
    description: '',
    tags: '',
    content: '',
    language: '',
    url: '',
  })

  useEffect(() => {
    if (!itemId) return
    setLoading(true)
    setIsEditing(false)
    setItem(null)
    const timer = setTimeout(() => {
      fetch(`/api/items/${itemId}`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to load item')
          return res.json()
        })
        .then((data: ItemWithType) => {
          setItem(data)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }, 150)
    return () => clearTimeout(timer)
  }, [itemId])

  function handleCopy() {
    if (!item?.content) return
    navigator.clipboard.writeText(item.content).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function enterEditMode() {
    if (!item) return
    setForm(formFromItem(item))
    setIsEditing(true)
  }

  function handleCancel() {
    setIsEditing(false)
  }

  async function handleSave() {
    if (!item) return
    setIsSaving(true)

    const tags = form.tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)

    const rawUrl = form.url.trim()
    const normalizedUrl = rawUrl && !/^https?:\/\//i.test(rawUrl) ? `https://${rawUrl}` : rawUrl

    const result = await updateItem(item.id, {
      title: form.title.trim(),
      description: form.description.trim() || null,
      content: form.content.trim() || null,
      url: normalizedUrl || null,
      language: form.language.trim() || null,
      tags,
    })

    setIsSaving(false)

    if (!result.success) {
      toast.error(result.error)
      return
    }

    setItem(result.data)
    setIsEditing(false)
    toast.success('Item updated')
    router.refresh()
  }

  async function handleDelete() {
    if (!item) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/items/${item.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Item deleted')
      onClose()
      router.refresh()
    } catch {
      toast.error('Failed to delete item')
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  const Icon = item ? (ICON_MAP[item.itemType.icon] ?? File) : File
  const typeName = item?.itemType.name ?? ''
  const showContent = CONTENT_TYPES.has(typeName)
  const showLanguage = LANGUAGE_TYPES.has(typeName)
  const showCode = CODE_TYPES.has(typeName)
  const showMarkdown = MARKDOWN_TYPES.has(typeName)
  const showUrl = typeName === 'link'
  const showFile = UPLOAD_TYPES.has(typeName) && !!item?.fileUrl
  const fileProxyUrl = item?.fileUrl ? `/api/files/${item.fileUrl}` : null

  return (
    <>
    <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete item?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete &ldquo;{item?.title}&rdquo;. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? 'Deleting…' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    <Sheet open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose() }}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-full sm:max-w-[520px] p-0 flex flex-col gap-0"
      >
        {/* Action bar */}
        <div className="flex items-center justify-between border-b border-border px-3 py-2.5 shrink-0">
          {isEditing ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={!form.title.trim() || isSaving}
              >
                {isSaving ? 'Saving…' : 'Save'}
              </Button>
            </>
          ) : (
            <>
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
                <Button
                  variant="ghost"
                  size="icon-sm"
                  title="Edit"
                  onClick={enterEditMode}
                  disabled={!item}
                >
                  <Pencil />
                </Button>
              </div>
              <div className="flex items-center gap-0.5">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  title="Delete"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setDeleteDialogOpen(true)}
                  disabled={!item}
                >
                  <Trash2 />
                </Button>
                <Button variant="ghost" size="icon-sm" title="Close" onClick={onClose}>
                  <X />
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <DrawerSkeleton />
          ) : item ? (
            isEditing ? (
              <div className="flex flex-col gap-5 p-5">
                {/* Type badge — non-editable */}
                <div className="flex items-center gap-2">
                  <div
                    className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
                    style={{ backgroundColor: `${item.itemType.color}15` }}
                  >
                    <Icon className="h-4 w-4" style={{ color: item.itemType.color }} />
                  </div>
                  <span
                    className="text-xs font-medium capitalize"
                    style={{ color: item.itemType.color }}
                  >
                    {item.itemType.name}
                  </span>
                </div>

                {/* Title */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Title <span className="text-destructive">*</span>
                  </label>
                  <input
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="Title"
                  />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Description
                  </label>
                  <textarea
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                    rows={3}
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Optional description"
                  />
                </div>

                {/* Tags */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Tags
                  </label>
                  <input
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    value={form.tags}
                    onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                    placeholder="react, typescript, utils"
                  />
                  <p className="text-xs text-muted-foreground">Comma-separated</p>
                </div>

                {/* Content (type-specific) */}
                {showContent && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Content
                    </label>
                    {showCode ? (
                      <CodeEditor
                        value={form.content}
                        onChange={(val) => setForm(f => ({ ...f, content: val }))}
                        language={form.language}
                      />
                    ) : showMarkdown ? (
                      <MarkdownEditor
                        value={form.content}
                        onChange={(val) => setForm(f => ({ ...f, content: val }))}
                      />
                    ) : (
                      <textarea
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                        rows={8}
                        value={form.content}
                        onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                        placeholder="Content…"
                      />
                    )}
                  </div>
                )}

                {/* Language (type-specific) */}
                {showLanguage && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Language
                    </label>
                    <input
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                      value={form.language}
                      onChange={e => setForm(f => ({ ...f, language: e.target.value }))}
                      placeholder="e.g. typescript"
                    />
                  </div>
                )}

                {/* URL (type-specific) */}
                {showUrl && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      URL
                    </label>
                    <input
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                      value={form.url}
                      onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
                      placeholder="https://…"
                    />
                  </div>
                )}

                {/* File (non-editable in edit mode) */}
                {showFile && item.fileName && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {typeName === 'image' ? 'Image' : 'File'}
                    </label>
                    <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
                      <File className="h-4 w-4 shrink-0" />
                      <span className="truncate">{item.fileName}</span>
                      {item.fileSize != null && (
                        <span className="ml-auto shrink-0">{formatBytes(item.fileSize)}</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Dates — non-editable */}
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
                </div>
              </div>
            ) : (
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

                {/* URL */}
                {item.url && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                      URL
                    </p>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline break-all"
                    >
                      {item.url}
                    </a>
                  </div>
                )}

                {/* File / Image */}
                {showFile && fileProxyUrl && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                      {typeName === 'image' ? 'Image' : 'File'}
                    </p>
                    {typeName === 'image' ? (
                      <div className="flex flex-col gap-2">
                        <div className="relative w-full max-h-64 aspect-video">
                          <NextImage
                            src={fileProxyUrl}
                            alt={item.fileName ?? 'Image'}
                            fill
                            className="rounded-lg border border-border object-contain"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-sm text-foreground truncate">{item.fileName}</span>
                            {item.fileSize != null && (
                              <span className="text-xs text-muted-foreground">{formatBytes(item.fileSize)}</span>
                            )}
                          </div>
                          <a
                            href={fileProxyUrl}
                            download={item.fileName ?? true}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
                          >
                            <Download className="h-3.5 w-3.5" />
                            Download
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 rounded-lg border border-border bg-[#1e1e1e] p-3">
                        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                          <File className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground truncate">{item.fileName}</p>
                          {item.fileSize != null && (
                            <p className="text-xs text-muted-foreground">{formatBytes(item.fileSize)}</p>
                          )}
                        </div>
                        <a
                          href={fileProxyUrl}
                          download={item.fileName ?? true}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm bg-secondary text-foreground hover:bg-secondary/80 transition-colors shrink-0"
                        >
                          <Download className="h-3.5 w-3.5" />
                          Download
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* Content */}
                {item.content && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                      Content
                    </p>
                    {showCode ? (
                      <CodeEditor
                        value={item.content}
                        language={item.language ?? ''}
                        readOnly
                      />
                    ) : showMarkdown ? (
                      <MarkdownEditor value={item.content} readOnly />
                    ) : (
                      <div className="rounded-lg bg-muted/50 border border-border p-3 overflow-x-auto">
                        <pre className="text-sm text-foreground whitespace-pre-wrap break-words font-mono">
                          {item.content}
                        </pre>
                      </div>
                    )}
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
            )
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
    </>
  )
}
