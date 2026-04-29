'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Code,
  Sparkles,
  StickyNote,
  Terminal,
  Link as LinkIcon,
  File as FileIcon,
  Image as ImageIcon,
} from 'lucide-react'
import { createItem } from '@/src/actions/items'
import CodeEditor from '@/src/components/ui/CodeEditor'
import MarkdownEditor from '@/src/components/ui/MarkdownEditor'
import FileUpload, { type UploadResult } from '@/src/components/ui/FileUpload'
import CollectionSelector from '@/src/components/collections/CollectionSelector'

const ITEM_TYPES = [
  { name: 'snippet', label: 'Snippet', icon: Code },
  { name: 'prompt', label: 'Prompt', icon: Sparkles },
  { name: 'command', label: 'Command', icon: Terminal },
  { name: 'note', label: 'Note', icon: StickyNote },
  { name: 'link', label: 'Link', icon: LinkIcon },
  { name: 'file', label: 'File', icon: FileIcon },
  { name: 'image', label: 'Image', icon: ImageIcon },
] as const

type ItemTypeName = (typeof ITEM_TYPES)[number]['name']

const CONTENT_TYPES = new Set<ItemTypeName>(['snippet', 'prompt', 'command', 'note'])
const LANGUAGE_TYPES = new Set<ItemTypeName>(['snippet', 'command'])
const MARKDOWN_TYPES = new Set<ItemTypeName>(['note', 'prompt'])
const UPLOAD_TYPES = new Set<ItemTypeName>(['file', 'image'])

const DEFAULT_FORM = {
  title: '',
  description: '',
  content: '',
  language: '',
  url: '',
  tags: '',
}

export default function NewItemDialog({
  open,
  onOpenChange,
  collections = [],
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  collections?: { id: string; name: string }[]
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [type, setType] = useState<ItemTypeName>('snippet')
  const [form, setForm] = useState(DEFAULT_FORM)
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null)
  const [collectionIds, setCollectionIds] = useState<string[]>([])

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) {
      setForm(DEFAULT_FORM)
      setType('snippet')
      setUploadResult(null)
      setCollectionIds([])
    }
    onOpenChange(isOpen)
  }

  function handleTypeChange(newType: ItemTypeName) {
    setType(newType)
    setForm(f => ({ ...f, content: '', language: '', url: '' }))
    setUploadResult(null)
  }

  function normalizeUrl(url: string): string {
    const trimmed = url.trim()
    if (!trimmed) return trimmed
    return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  }

  function handleSubmit() {
    const tags = form.tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)

    startTransition(async () => {
      const result = await createItem({
        type,
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        content: form.content.trim() || undefined,
        language: form.language.trim() || undefined,
        url: type === 'link' ? normalizeUrl(form.url) || undefined : undefined,
        fileKey: uploadResult?.key,
        fileName: uploadResult?.fileName,
        fileSize: uploadResult?.fileSize,
        tags,
        collectionIds,
      })

      if (!result.success) {
        toast.error(result.error)
        return
      }

      toast.success('Item created')
      handleOpenChange(false)
      router.refresh()
    })
  }

  const showContent = CONTENT_TYPES.has(type)
  const showLanguage = LANGUAGE_TYPES.has(type)
  const showMarkdown = MARKDOWN_TYPES.has(type)
  const showUrl = type === 'link'
  const showUpload = UPLOAD_TYPES.has(type)

  const isValid =
    form.title.trim().length > 0 &&
    (type !== 'link' || form.url.trim().length > 0) &&
    (!showUpload || uploadResult !== null)

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New Item</DialogTitle>
        </DialogHeader>

        {/* Type selector */}
        <div className="flex gap-1.5 flex-wrap">
          {ITEM_TYPES.map(({ name, label, icon: Icon }) => (
            <button
              key={name}
              type="button"
              onClick={() => handleTypeChange(name)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                type === name
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Form fields */}
        <div className="flex flex-col gap-4">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Title <span className="text-destructive">*</span>
            </label>
            <input
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Give it a name"
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Description
            </label>
            <textarea
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
              rows={2}
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
              placeholder="react, typescript (comma-separated)"
            />
          </div>

          {/* Collections */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Collections
            </label>
            <CollectionSelector
              collections={collections}
              value={collectionIds}
              onChange={setCollectionIds}
            />
          </div>

          {/* File / Image upload */}
          {showUpload && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {type === 'image' ? 'Image' : 'File'}{' '}
                <span className="text-destructive">*</span>
              </label>
              <FileUpload
                itemType={type as 'file' | 'image'}
                value={uploadResult}
                onUpload={setUploadResult}
              />
            </div>
          )}

          {/* Content */}
          {showContent && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Content
              </label>
              {showLanguage ? (
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
                  rows={5}
                  value={form.content}
                  onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  placeholder="Content…"
                />
              )}
            </div>
          )}

          {/* Language */}
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

          {/* URL */}
          {showUrl && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                URL <span className="text-destructive">*</span>
              </label>
              <input
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                value={form.url}
                onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
                placeholder="https://…"
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <DialogClose render={<Button variant="outline" disabled={isPending} />}>
            Cancel
          </DialogClose>
          <Button onClick={handleSubmit} disabled={!isValid || isPending}>
            {isPending ? 'Creating…' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
