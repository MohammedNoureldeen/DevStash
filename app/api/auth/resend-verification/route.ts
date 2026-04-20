import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'
import { sendVerificationEmail } from '@/src/lib/email'
import { resendVerificationLimiter, getIP, rateLimit } from '@/src/lib/rate-limit'

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
  }

  const { limited, response } = await rateLimit(
    resendVerificationLimiter,
    `${getIP(req)}:${email}`
  )
  if (limited) return response!

  const user = await prisma.user.findUnique({ where: { email } })

  if (user && !user.emailVerified) {
    await prisma.verificationToken.deleteMany({ where: { identifier: email } })

    const token = crypto.randomUUID()
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)

    await prisma.verificationToken.create({
      data: { identifier: email, token, expires },
    })

    await sendVerificationEmail(email, token)
  }

  return NextResponse.json({ success: true })
}
