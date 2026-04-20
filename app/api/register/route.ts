import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

import { prisma } from '@/src/lib/prisma'
import { sendVerificationEmail } from '@/src/lib/email'
import { registerLimiter, getIP, rateLimit } from '@/src/lib/rate-limit'

export async function POST(request: Request) {
  const { limited, response } = await rateLimit(registerLimiter, getIP(request))
  if (limited) return response!

  try {
    const { name, email, password, confirmPassword } = await request.json() as {
      name: string
      email: string
      password: string
      confirmPassword: string
    }

    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    await prisma.user.create({
      data: { name, email, password: hashedPassword },
    })

    const token = crypto.randomUUID()
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)

    await prisma.verificationToken.create({
      data: { identifier: email, token, expires },
    })

    await sendVerificationEmail(email, token)

    return NextResponse.json({ success: true }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
