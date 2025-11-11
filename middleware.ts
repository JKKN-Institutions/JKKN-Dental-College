import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session if it exists
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser()

  if (authError) {
    console.error('[MIDDLEWARE] Auth error:', authError)
  }

  const path = request.nextUrl.pathname

  if (user) {
    console.log('[MIDDLEWARE] Authenticated user:', user.email, 'ID:', user.id)
  }

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/auth/login', '/auth/error', '/auth/callback', '/auth/unauthorized']
  const isPublicRoute = publicRoutes.some(route => path === route || path.startsWith(route))

  // If accessing a public route, allow access
  if (isPublicRoute) {
    return response
  }

  // Check if user is authenticated
  if (!user) {
    console.log('[MIDDLEWARE] No user session, redirecting to login')
    const redirectUrl = new URL('/auth/login', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // Verify email domain restriction
  if (user.email && !user.email.endsWith('@jkkn.ac.in')) {
    console.log('[MIDDLEWARE] Invalid domain:', user.email)
    // Sign out the user
    await supabase.auth.signOut()
    const redirectUrl = new URL('/auth/unauthorized', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // Check admin access for /admin routes
  if (path.startsWith('/admin')) {
    console.log('[MIDDLEWARE] Checking admin access for user:', user.email, 'ID:', user.id)

    // First, get the profile (without join to avoid RLS complexity)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role_type, status, role_id, custom_permissions')
      .eq('id', user.id)
      .maybeSingle()

    // Log any errors
    if (profileError) {
      console.error('[MIDDLEWARE] Error fetching profile:', profileError)
    }

    console.log('[MIDDLEWARE] Profile data:', profile)

    // Check if user has profile
    if (!profile) {
      console.log('[MIDDLEWARE] No profile found for user:', user.email, 'Error:', profileError?.message)
      const redirectUrl = new URL('/auth/unauthorized', request.url)
      return NextResponse.redirect(redirectUrl)
    }

    // Check if account is active
    if (profile.status !== 'active') {
      console.log('[MIDDLEWARE] Account not active:', user.email, 'Status:', profile.status)
      const redirectUrl = new URL('/auth/unauthorized', request.url)
      return NextResponse.redirect(redirectUrl)
    }

    // Allow both super_admin and custom_role to access admin area
    const allowedRoleTypes = ['super_admin', 'custom_role']
    if (allowedRoleTypes.includes(profile.role_type) && profile.status === 'active') {
      console.log('[MIDDLEWARE] ✅ Admin access GRANTED for:', user.email, 'Role:', profile.role_type, '(User ID:', user.id + ')')
      return response
    }

    // Block regular users and inactive accounts
    console.log('[MIDDLEWARE] ❌ Access BLOCKED for:', user.email)
    console.log('[MIDDLEWARE] Role type:', profile.role_type, '(Allowed: super_admin, custom_role)')
    console.log('[MIDDLEWARE] Status:', profile.status)

    const redirectUrl = new URL('/auth/unauthorized', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  console.log('[MIDDLEWARE] Access granted for:', user.email, 'Path:', path)
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes that should be public
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
