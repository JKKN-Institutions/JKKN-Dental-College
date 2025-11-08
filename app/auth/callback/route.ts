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
      // Successful authentication
      console.log('[AUTH CALLBACK] Authentication successful, redirecting to:', next)

      // Create user profile if it doesn't exist (fallback if trigger doesn't work)
      try {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert(
            {
              id: data.user.id,
              email: data.user.email,
              full_name: data.user.user_metadata?.full_name || null,
              avatar_url: data.user.user_metadata?.avatar_url || null,
              status: 'active',
            },
            {
              onConflict: 'id',
              ignoreDuplicates: true,
            }
          )

        if (profileError) {
          console.error('[AUTH CALLBACK] Error creating user profile:', profileError)
        } else {
          console.log('[AUTH CALLBACK] User profile ensured')
        }
      } catch (profileErr) {
        console.error('[AUTH CALLBACK] Exception creating profile:', profileErr)
      }

      // Get the correct redirect URL for both development and production
      const forwardedHost = request.headers.get('x-forwarded-host')
      const forwardedProto = request.headers.get('x-forwarded-proto')
      const isLocalEnv = process.env.NODE_ENV === 'development'

      let redirectUrl: string

      if (isLocalEnv) {
        // Development: use origin (http://localhost:3000 or 3001)
        redirectUrl = `${origin}${next}`
      } else if (forwardedHost) {
        // Production (Vercel): use x-forwarded-host with proper protocol
        const protocol = forwardedProto || 'https'
        redirectUrl = `${protocol}://${forwardedHost}${next}`
      } else if (process.env.NEXT_PUBLIC_APP_URL) {
        // Fallback: use environment variable if set
        redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}${next}`
      } else {
        // Last resort: use origin
        redirectUrl = `${origin}${next}`
      }

      console.log('[AUTH CALLBACK] Redirecting to:', redirectUrl)
      return NextResponse.redirect(redirectUrl)
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
