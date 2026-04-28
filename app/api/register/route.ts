import { NextResponse } from 'next/server'
import { z } from 'zod'

import { prisma } from '@/src/lib/prisma'
import { sendVerificationEmail } from '@/src/lib/email'
import { registerLimiter, getIP, rateLimit } from '@/src/lib/rate-limit'
import { hashPassword } from '@/src/lib/password'

const registerSchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export async function POST(request: Request) {
  const { limited, response } = await rateLimit(registerLimiter, getIP(request))
  if (limited) return response!

  try {
    const parsed = registerSchema.safeParse(await request.json())
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? 'Invalid input'
      return NextResponse.json({ error: message }, { status: 400 })
    }

    const { name, email, password } = parsed.data

    const existingUser = await prisma.user.findUnique({ where: { email } })

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    const hashedPassword = await hashPassword(password)

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
