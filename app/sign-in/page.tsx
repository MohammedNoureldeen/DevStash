import SignInForm from './sign-in-form'

type SignInPageProps = {
  searchParams: Promise<{
    callbackUrl?: string | string[]
    verified?: string
    reset?: string
  }>
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { callbackUrl, verified, reset } = await searchParams
  const raw = typeof callbackUrl === 'string' ? callbackUrl : callbackUrl?.[0]
  const resolvedCallbackUrl = typeof raw === 'string' && raw.startsWith('/') ? raw : '/dashboard'

  return (
    <SignInForm
      callbackUrl={resolvedCallbackUrl}
      verified={verified === '1'}
      reset={reset === '1'}
    />
  )
}
