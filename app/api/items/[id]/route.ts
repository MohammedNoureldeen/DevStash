import { NextResponse } from 'next/server'
import { auth } from '@/src/auth'
import { getItemById, deleteItem } from '@/src/lib/db/items'
import { deleteFromR2 } from '@/src/lib/r2'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const item = await getItemById(id, session.user.id)
  if (!item) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(item)
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const item = await getItemById(id, session.user.id)
  if (!item) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  if (item.fileUrl) {
    try {
      await deleteFromR2(item.fileUrl)
    } catch {
      // proceed even if R2 deletion fails — DB record is the source of truth
    }
  }

  await deleteItem(id, session.user.id)
  return new NextResponse(null, { status: 204 })
}
