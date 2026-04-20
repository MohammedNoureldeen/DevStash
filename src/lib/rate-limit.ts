import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL ?? '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN ?? '',
})

export const loginLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '15 m'),
  prefix: 'rl:login',
})

export const registerLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '1 h'),
  prefix: 'rl:register',
})

export const forgotPasswordLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '1 h'),
  prefix: 'rl:forgot-password',
})

export const resetPasswordLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '15 m'),
  prefix: 'rl:reset-password',
})

export const resendVerificationLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '15 m'),
  prefix: 'rl:resend-verification',
})

export function getIP(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  return forwarded?.split(',')[0].trim() ?? 'anonymous'
}

export async function rateLimit(
  limiter: Ratelimit,
  key: string
): Promise<{ limited: boolean; response?: NextResponse }> {
  try {
    const { success, reset } = await limiter.limit(key)
    if (!success) {
      const retryAfter = Math.ceil((reset - Date.now()) / 1000)
      const minutes = Math.ceil(retryAfter / 60)
      return {
        limited: true,
        response: NextResponse.json(
          { error: `Too many attempts. Please try again in ${minutes} minute${minutes !== 1 ? 's' : ''}.` },
          { status: 429, headers: { 'Retry-After': String(retryAfter) } }
        ),
      }
    }
    return { limited: false }
  } catch {
    return { limited: false }
  }
}
