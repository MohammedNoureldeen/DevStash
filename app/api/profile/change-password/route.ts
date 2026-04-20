import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { auth } from '@/src/auth'
import { prisma } from '@/src/lib/prisma'

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { currentPassword, newPassword } = await req.json() as {
    currentPassword: string
    newPassword: string
  }

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  if (newPassword.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { password: true },
  })

  if (!user?.password) {
    return NextResponse.json({ error: 'No password set on this account' }, { status: 400 })
  }

  const isValid = await bcrypt.compare(currentPassword, user.password)
  if (!isValid) {
    return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
  }

  const hashed = await bcrypt.hash(newPassword, 12)
  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashed },
  })

  return NextResponse.json({ success: true })
}
