'use client'

import { useState } from 'react'
import Editor, { type OnMount } from '@monaco-editor/react'
import { Copy, Check } from 'lucide-react'

interface CodeEditorProps {
  value: string
  onChange?: (value: string) => void
  language?: string
  readOnly?: boolean
}

const MIN_HEIGHT = 100
const MAX_HEIGHT = 360

export default function CodeEditor({
  value,
  onChange,
  language,
  readOnly = false,
}: CodeEditorProps) {
  const [copied, setCopied] = useState(false)
  const [editorHeight, setEditorHeight] = useState(MIN_HEIGHT)

  const monacoLang = (language?.trim() || 'plaintext').toLowerCase()
  const displayLang = language?.trim() || ''

  const handleMount: OnMount = (editor) => {
    const updateHeight = () => {
      const h = Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, editor.getContentHeight()))
      setEditorHeight(h)
    }
    editor.onDidContentSizeChange(updateHeight)
    updateHeight()
  }

  function handleCopy() {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="rounded-lg overflow-hidden border border-border">
      {/* macOS-style header */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#1e1e1e]">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57] inline-block" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e] inline-block" />
          <span className="w-3 h-3 rounded-full bg-[#28c840] inline-block" />
        </div>
        <div className="flex items-center gap-3">
          {displayLang && (
            <span className="text-xs text-zinc-400 font-mono select-none">
              {displayLang}
            </span>
          )}
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
      </div>

      <Editor
        value={value}
        onChange={readOnly ? undefined : (val) => onChange?.(val ?? '')}
        language={monacoLang}
        theme="vs-dark"
        height={editorHeight}
        onMount={handleMount}
        loading={
          <div
            className="flex items-center justify-center bg-[#1e1e1e]"
            style={{ height: editorHeight }}
          >
            <span className="text-xs text-zinc-500">Loading editor…</span>
          </div>
        }
        options={{
          readOnly,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          fontSize: 13,
          lineNumbers: readOnly ? 'off' : 'on',
          padding: { top: 12, bottom: 12 },
          scrollbar: {
            vertical: 'auto',
            horizontal: 'hidden',
            verticalScrollbarSize: 6,
            useShadows: false,
          },
          overviewRulerLanes: 0,
          renderLineHighlight: readOnly ? 'none' : 'line',
          folding: false,
          glyphMargin: false,
          automaticLayout: true,
          lineDecorationsWidth: readOnly ? 0 : 10,
          lineNumbersMinChars: readOnly ? 0 : 3,
        }}
      />
    </div>
  )
}
