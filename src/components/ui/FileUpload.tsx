'use client'

import { useState, useRef, useEffect } from 'react'
import { Upload, X, FileIcon, Loader2, Check } from 'lucide-react'

export type UploadResult = {
  key: string
  fileName: string
  fileSize: number
  mimeType: string
}

type FileUploadProps = {
  itemType: 'file' | 'image'
  value: UploadResult | null
  onUpload: (result: UploadResult | null) => void
}

const IMAGE_MIME_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
  'image/svg+xml',
])

const FILE_MIME_TYPES = new Set([
  'application/pdf',
  'text/plain',
  'text/markdown',
  'application/json',
  'application/x-yaml',
  'text/yaml',
  'application/xml',
  'text/xml',
  'text/csv',
  'application/toml',
])

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function FileUpload({ itemType, value, onUpload }: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const xhrRef = useRef<XMLHttpRequest | null>(null)

  const allowedMime = itemType === 'image' ? IMAGE_MIME_TYPES : FILE_MIME_TYPES
  const maxBytes = itemType === 'image' ? 5 * 1024 * 1024 : 10 * 1024 * 1024
  const accept =
    itemType === 'image'
      ? '.png,.jpg,.jpeg,.gif,.webp,.svg'
      : '.pdf,.txt,.md,.json,.yaml,.yml,.xml,.csv,.toml,.ini'
  const label =
    itemType === 'image'
      ? 'PNG, JPG, GIF, WEBP, SVG · Max 5 MB'
      : 'PDF, TXT, MD, JSON, YAML, XML, CSV, TOML · Max 10 MB'

  useEffect(() => {
    return () => {
      xhrRef.current?.abort()
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  async function startUpload(file: File) {
    setError(null)

    if (!allowedMime.has(file.type)) {
      setError('Unsupported file type')
      return
    }
    if (file.size > maxBytes) {
      setError(`File too large (max ${maxBytes / 1024 / 1024} MB)`)
      return
    }

    if (itemType === 'image') {
      setPreview(URL.createObjectURL(file))
    }

    setUploading(true)
    setProgress(0)

    try {
      // Phase 1: get a presigned PUT URL from our API (tiny JSON body, no file)
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, fileSize: file.size, mimeType: file.type }),
      })

      const text = await res.text()
      const data = text ? (JSON.parse(text) as { uploadUrl?: string; key?: string; fileName?: string; fileSize?: number; mimeType?: string; error?: string }) : {}

      if (!res.ok) {
        throw new Error((data as { error?: string }).error ?? `Server error (${res.status})`)
      }

      const { uploadUrl, key, fileName, fileSize, mimeType } = data as Required<typeof data>

      // Phase 2: PUT the file directly to R2 — bypasses Vercel entirely
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhrRef.current = xhr

        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100))
        })

        xhr.onload = () => {
          xhrRef.current = null
          xhr.status < 300 ? resolve() : reject(new Error('Storage upload failed'))
        }

        xhr.onerror = () => {
          xhrRef.current = null
          reject(new Error('Upload failed'))
        }

        xhr.open('PUT', uploadUrl)
        xhr.setRequestHeader('Content-Type', file.type)
        xhr.send(file)
      })

      onUpload({ key, fileName, fileSize, mimeType })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
      if (preview) {
        URL.revokeObjectURL(preview)
        setPreview(null)
      }
    } finally {
      setUploading(false)
      xhrRef.current = null
    }
  }

  function handleClear() {
    xhrRef.current?.abort()
    xhrRef.current = null
    if (preview) {
      URL.revokeObjectURL(preview)
      setPreview(null)
    }
    onUpload(null)
    setError(null)
    setProgress(0)
    setUploading(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave(e: React.DragEvent) {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragging(false)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) startUpload(file)
  }

  if (value) {
    return (
      <div className="rounded-lg border border-border bg-[#1e1e1e] p-3 flex items-center gap-3">
        {itemType === 'image' && preview ? (
          <img
            src={preview}
            alt={value.fileName}
            className="w-12 h-12 rounded object-cover shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
            <FileIcon className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-foreground truncate">{value.fileName}</p>
          <p className="text-xs text-muted-foreground">{formatBytes(value.fileSize)}</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Check className="h-4 w-4 text-emerald-400" />
          <button
            type="button"
            onClick={handleClear}
            className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            title="Remove file"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`rounded-lg border-2 border-dashed transition-colors cursor-pointer select-none ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-muted-foreground/50 bg-[#1e1e1e]'
        } ${uploading ? 'cursor-default pointer-events-none' : ''}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) startUpload(file)
          }}
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-3 py-6 px-4">
            <Loader2 className="h-6 w-6 text-primary animate-spin" />
            <div className="w-full max-w-xs flex flex-col gap-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Uploading…</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-6 px-4">
            <Upload className="h-7 w-7 text-muted-foreground" />
            <p className="text-sm text-foreground font-medium">
              Drop file here or{' '}
              <span className="text-primary underline underline-offset-2">browse</span>
            </p>
            <p className="text-xs text-muted-foreground text-center">{label}</p>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
