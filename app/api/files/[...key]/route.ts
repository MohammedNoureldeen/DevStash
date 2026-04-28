import { NextResponse } from 'next/server'
import { auth } from '@/src/auth'
import { getFromR2 } from '@/src/lib/r2'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ key: string[] }> },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { key: segments } = await params
  const key = segments.join('/')

  if (!key.startsWith(`${session.user.id}/`)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const object = await getFromR2(key)
    const stream = object.Body?.transformToWebStream()
    if (!stream) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const fileName = segments[segments.length - 1]
    return new NextResponse(stream, {
      headers: {
        'Content-Type': object.ContentType ?? 'application/octet-stream',
        'Content-Length': String(object.ContentLength ?? ''),
        'Content-Disposition': `inline; filename="${fileName}"`,
        'Cache-Control': 'private, max-age=3600',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}
