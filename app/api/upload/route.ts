import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { auth } from '@/src/auth'
import { uploadToR2 } from '@/src/lib/r2'

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

  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  }

  const file = formData.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const isImage = IMAGE_MIME_TYPES.has(file.type)
  const isFile = FILE_MIME_TYPES.has(file.type)

  if (!isImage && !isFile) {
    return NextResponse.json({ error: `Unsupported file type: ${file.type}` }, { status: 400 })
  }

  const maxBytes = isImage ? MAX_IMAGE_BYTES : MAX_FILE_BYTES
  if (file.size > maxBytes) {
    const maxMB = maxBytes / 1024 / 1024
    return NextResponse.json({ error: `File too large (max ${maxMB}MB)` }, { status: 400 })
  }

  const ext = file.name.split('.').pop() ?? 'bin'
  const key = `${session.user.id}/${randomUUID()}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  try {
    await uploadToR2(key, buffer, file.type)
  } catch {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }

  return NextResponse.json({
    key,
    fileName: file.name,
    fileSize: file.size,
    mimeType: file.type,
  })
}
