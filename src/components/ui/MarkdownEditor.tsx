'use client'

import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Copy, Check } from 'lucide-react'

interface MarkdownEditorProps {
  value: string
  onChange?: (value: string) => void
  readOnly?: boolean
  placeholder?: string
}

const MIN_HEIGHT = 100
const MAX_HEIGHT = 400

type Tab = 'write' | 'preview'

export default function MarkdownEditor({
  value,
  onChange,
  readOnly = false,
  placeholder = 'Write markdown…',
}: MarkdownEditorProps) {
  const [tab, setTab] = useState<Tab>(readOnly ? 'preview' : 'write')
  const [copied, setCopied] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const el = textareaRef.current
    if (!el || tab !== 'write') return
    el.style.height = 'auto'
    el.style.height = `${Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, el.scrollHeight))}px`
  }, [value, tab])

  function handleCopy() {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="rounded-lg overflow-hidden border border-border">
      <div className="flex items-center justify-between px-3 py-2 bg-[#2d2d2d]">
        <div className="flex items-center gap-0.5">
          {!readOnly && (
            <button
              type="button"
              onClick={() => setTab('write')}
              className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${
                tab === 'write'
                  ? 'bg-[#1e1e1e] text-zinc-200'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Write
            </button>
          )}
          <button
            type="button"
            onClick={() => setTab('preview')}
            className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${
              tab === 'preview'
                ? 'bg-[#1e1e1e] text-zinc-200'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Preview
          </button>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          title={copied ? 'Copied!' : 'Copy'}
          className="flex items-center justify-center w-6 h-6 rounded text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-emerald-400" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {tab === 'write' ? (
        <textarea
          ref={textareaRef}
          className="w-full bg-[#1e1e1e] text-zinc-200 text-sm font-mono px-4 py-3 focus:outline-none resize-none placeholder:text-zinc-600 overflow-y-auto"
          style={{ minHeight: MIN_HEIGHT, maxHeight: MAX_HEIGHT }}
          value={value}
          onChange={e => onChange?.(e.target.value)}
          placeholder={placeholder}
          spellCheck={false}
        />
      ) : (
        <div
          className="markdown-preview bg-[#1e1e1e] px-4 py-3 overflow-y-auto"
          style={{ minHeight: MIN_HEIGHT, maxHeight: MAX_HEIGHT }}
        >
          {value.trim() ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
          ) : (
            <p className="text-zinc-600 text-sm italic">Nothing to preview</p>
          )}
        </div>
      )}
    </div>
  )
}
