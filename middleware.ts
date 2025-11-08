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
  const publicRoutes = ['/auth/login', '/auth/error', '/auth/callback', '/auth/unauthorized']
  const isPublicRoute = publicRoutes.some(route => path.startsWith(route))

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

    // Super admin has full access
    if (profile.role_type === 'super_admin') {
      console.log('[MIDDLEWARE] Super admin access granted for:', user.email)
      return response
    }

    // Check if user has custom_role or custom_permissions
    if (profile.role_type === 'custom_role' || profile.custom_permissions) {
      let permissions = profile.custom_permissions || {}

      // If user has a role_id, fetch the role permissions
      if (profile.role_id && !profile.custom_permissions) {
        const { data: role } = await supabase
          .from('roles')
          .select('permissions')
          .eq('id', profile.role_id)
          .maybeSingle()

        if (role) {
          permissions = role.permissions
        }
      }

      // Check if user has at least dashboard.view permission
      if (permissions.dashboard?.view === true) {
        console.log('[MIDDLEWARE] Custom role access granted for:', user.email)
        return response
      }

      console.log('[MIDDLEWARE] User lacks dashboard.view permission:', user.email)
      const redirectUrl = new URL('/auth/unauthorized', request.url)
      return NextResponse.redirect(redirectUrl)
    }

    // Regular user - no admin access
    console.log('[MIDDLEWARE] User is not an admin:', user.email, 'Role type:', profile.role_type)
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
