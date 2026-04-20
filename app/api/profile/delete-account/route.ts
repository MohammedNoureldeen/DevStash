import { NextResponse } from 'next/server'
import { auth, signOut } from '@/src/auth'
import { prisma } from '@/src/lib/prisma'

export async function DELETE() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await prisma.user.delete({ where: { id: session.user.id } })

  return NextResponse.json({ success: true })
}
