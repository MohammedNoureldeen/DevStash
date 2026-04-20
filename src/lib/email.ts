import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = process.env.EMAIL_FROM ?? 'onboarding@resend.dev'
const APP_URL = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Reset your DevStash password',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2>Reset your password</h2>
        <p>We received a request to reset your DevStash password. Click the button below to choose a new password.</p>
        <a href="${resetUrl}"
           style="display:inline-block;background:#6366f1;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;margin:16px 0">
          Reset password
        </a>
        <p style="color:#888;font-size:13px">This link expires in 1 hour. If you didn't request a password reset, you can ignore this email.</p>
        <p style="color:#aaa;font-size:12px">Or copy this link: ${resetUrl}</p>
      </div>
    `,
  })
}

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${APP_URL}/api/auth/verify-email?token=${token}`

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Verify your DevStash email',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2>Verify your email</h2>
        <p>Thanks for signing up for DevStash. Click the button below to verify your email address.</p>
        <a href="${verifyUrl}"
           style="display:inline-block;background:#6366f1;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;margin:16px 0">
          Verify email
        </a>
        <p style="color:#888;font-size:13px">This link expires in 24 hours. If you didn't create an account, you can ignore this email.</p>
        <p style="color:#aaa;font-size:12px">Or copy this link: ${verifyUrl}</p>
      </div>
    `,
  })
}
