import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/src/lib/prisma'
import { resetPasswordLimiter, getIP, rateLimit } from '@/src/lib/rate-limit'

export async function POST(req: NextRequest) {
  const { limited, response } = await rateLimit(resetPasswordLimiter, getIP(req))
  if (limited) return response!

  const { token, password, confirmPassword } = await req.json()

  if (!token || typeof token !== 'string') {
    return NextResponse.json({ error: 'Invalid or missing token.' }, { status: 400 })
  }

  if (!password || password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
  }

  if (password !== confirmPassword) {
    return NextResponse.json({ error: 'Passwords do not match.' }, { status: 400 })
  }

  const record = await prisma.verificationToken.findUnique({
    where: { token },
  })

  if (!record || !record.identifier.startsWith('password-reset:')) {
    return NextResponse.json({ error: 'Invalid or expired reset link.' }, { status: 400 })
  }

  if (record.expires < new Date()) {
    await prisma.verificationToken.delete({
      where: { identifier_token: { identifier: record.identifier, token } },
    })
    return NextResponse.json({ error: 'Reset link has expired.' }, { status: 400 })
  }

  const email = record.identifier.replace('password-reset:', '')
  const hashedPassword = await bcrypt.hash(password, 12)

  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
  })

  await prisma.verificationToken.delete({
    where: { identifier_token: { identifier: record.identifier, token } },
  })

  return NextResponse.json({ success: true })
}
