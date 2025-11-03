import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  console.log('[AUTH CALLBACK] Starting authentication callback')
  console.log('[AUTH CALLBACK] Code present:', !!code)

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    console.log('[AUTH CALLBACK] Exchange result:', {
      hasError: !!error,
      hasUser: !!data?.user,
      email: data?.user?.email,
      error: error?.message
    })

    if (!error && data.user) {
      // Check if email domain restriction is enabled
      const disableEmailRestriction = process.env.NEXT_PUBLIC_DISABLE_EMAIL_RESTRICTION === 'true'
      const emailValid = disableEmailRestriction || data.user.email?.endsWith('@jkkn.ac.in')

      console.log('[AUTH CALLBACK] Email validation:', {
        email: data.user.email,
        endsWithJKKN: data.user.email?.endsWith('@jkkn.ac.in'),
        disableRestriction: disableEmailRestriction,
        emailValid
      })

      if (!emailValid) {
        // Sign out user with invalid domain
        console.log('[AUTH CALLBACK] Invalid domain, signing out')
        await supabase.auth.signOut()
        return NextResponse.redirect(`${origin}/auth/unauthorized`)
      }

      // Successful authentication with valid domain
      console.log('[AUTH CALLBACK] Authentication successful, redirecting to:', next)
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    } else {
      console.log('[AUTH CALLBACK] Exchange failed or no user, going to error page')
    }
  } else {
    console.log('[AUTH CALLBACK] No code provided')
  }

  // Return to error page if something went wrong
  console.log('[AUTH CALLBACK] Redirecting to error page')
  return NextResponse.redirect(`${origin}/auth/error`)
}
