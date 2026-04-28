import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { auth } from '@/src/auth'
import { getPresignedUploadUrl } from '@/src/lib/r2'

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

const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const MAX_FILE_BYTES = 10 * 1024 * 1024

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { fileName: string; fileSize: number; mimeType: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { fileName, fileSize, mimeType } = body
  if (!fileName || typeof fileSize !== 'number' || !mimeType) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const isImage = IMAGE_MIME_TYPES.has(mimeType)
  const isFile = FILE_MIME_TYPES.has(mimeType)

  if (!isImage && !isFile) {
    return NextResponse.json({ error: `Unsupported file type: ${mimeType}` }, { status: 400 })
  }

  const maxBytes = isImage ? MAX_IMAGE_BYTES : MAX_FILE_BYTES
  if (fileSize > maxBytes) {
    const maxMB = maxBytes / 1024 / 1024
    return NextResponse.json({ error: `File too large (max ${maxMB}MB)` }, { status: 400 })
  }

  const R2_VARS = ['R2_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET_NAME'] as const
  const missingVars = R2_VARS.filter((v) => !process.env[v])
  if (missingVars.length > 0) {
    console.error(
      '[upload] Missing R2 env vars:',
      missingVars.join(', '),
      '| Present:',
      R2_VARS.filter((v) => !!process.env[v]).join(', ') || 'none',
    )
    return NextResponse.json(
      { error: `R2 not configured. Missing env vars: ${missingVars.join(', ')}` },
      { status: 500 },
    )
  }

  const ext = fileName.split('.').pop() ?? 'bin'
  const key = `${session.user.id}/${randomUUID()}.${ext}`

  let uploadUrl: string
  try {
    uploadUrl = await getPresignedUploadUrl(key, mimeType)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[upload] getPresignedUploadUrl failed:', err)
    return NextResponse.json({ error: `Failed to generate upload URL: ${message}` }, { status: 500 })
  }

  return NextResponse.json({ uploadUrl, key, fileName, fileSize, mimeType })
}
