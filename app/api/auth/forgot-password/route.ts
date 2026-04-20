import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'
import { sendPasswordResetEmail } from '@/src/lib/email'

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { email } })

  if (user) {
    const token = crypto.randomUUID()
    const expires = new Date(Date.now() + 60 * 60 * 1000)
    const identifier = `password-reset:${email}`

    await prisma.verificationToken.deleteMany({ where: { identifier } })

    await prisma.verificationToken.create({
      data: { identifier, token, expires },
    })

    await sendPasswordResetEmail(email, token)
  }

  // Always return success to avoid leaking whether an email exists
  return NextResponse.json({ success: true })
}
