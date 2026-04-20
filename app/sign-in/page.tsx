import SignInForm from './sign-in-form'

type SignInPageProps = {
  searchParams: Promise<{
    callbackUrl?: string | string[]
    verified?: string
  }>
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { callbackUrl, verified } = await searchParams
  const resolvedCallbackUrl =
    typeof callbackUrl === 'string' ? callbackUrl : callbackUrl?.[0] ?? '/dashboard'

  return <SignInForm callbackUrl={resolvedCallbackUrl} verified={verified === '1'} />
}
