import { updateSession } from '@/lib/supabase/middleware'
import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  try {
    // 🎨 DEMO MODE: Bypass all authentication checks
    // Set NEXT_PUBLIC_DEMO_MODE=true in .env.local to preview admin panel
    const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

    if (DEMO_MODE) {
      console.log('🎨 [DEMO MODE] Authentication bypassed - allowing all access')
      return NextResponse.next()
    }

    // Check if required environment variables are present
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('❌ Missing Supabase environment variables')
      return NextResponse.next()
    }

    // Update session
    const supabaseResponse = await updateSession(request)

    // Create Supabase client for middleware
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            )
          },
        },
      }
    )

    // Get user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    // If there's an error getting the user, log it but continue
    if (userError) {
      console.error('❌ Error getting user in middleware:', userError.message)
    }

    const path = request.nextUrl.pathname

    // Public routes that don't require authentication
    const publicRoutes = ['/auth/login', '/auth/error', '/auth/unauthorized', '/auth/callback']
    const isPublicRoute = publicRoutes.some(route => path.startsWith(route))

    // Admin routes that require admin role
    const isAdminRoute = path.startsWith('/admin')

    // If accessing a protected route without being logged in
    if (!user && !isPublicRoute) {
      const url = request.nextUrl.clone()
      url.pathname = '/auth/login'
      url.searchParams.set('next', path)
      return NextResponse.redirect(url)
    }

    // If logged in and trying to access login page, redirect to home
    if (user && path === '/auth/login') {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }

    // Check admin access for admin routes
    if (user && isAdminRoute) {
      try {
        // Get admin profile to check role
        const { data: adminProfile, error: profileError } = await supabase
          .from('admin_profiles')
          .select('role, status')
          .eq('id', user.id)
          .single()

        // If there's an error fetching profile, log and redirect
        if (profileError) {
          console.error('❌ Error fetching admin profile:', profileError.message)
          const url = request.nextUrl.clone()
          url.pathname = '/auth/unauthorized'
          return NextResponse.redirect(url)
        }

        // Check if admin profile doesn't exist (regular user trying to access admin)
        if (!adminProfile) {
          const url = request.nextUrl.clone()
          url.pathname = '/auth/unauthorized'
          return NextResponse.redirect(url)
        }

        // Check if admin is blocked
        if (adminProfile.status === 'blocked') {
          await supabase.auth.signOut()
          const url = request.nextUrl.clone()
          url.pathname = '/auth/unauthorized'
          return NextResponse.redirect(url)
        }

        // Check if has valid admin role (admin or super_admin)
        if (adminProfile.role !== 'admin' && adminProfile.role !== 'super_admin') {
          const url = request.nextUrl.clone()
          url.pathname = '/auth/unauthorized'
          return NextResponse.redirect(url)
        }
      } catch (error) {
        console.error('❌ Error in admin route check:', error)
        const url = request.nextUrl.clone()
        url.pathname = '/auth/unauthorized'
        return NextResponse.redirect(url)
      }
    }

    return supabaseResponse
  } catch (error) {
    // Catch any unexpected errors in middleware
    console.error('❌ Middleware error:', error)
    // Allow the request to continue even if middleware fails
    return NextResponse.next()
  }
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
