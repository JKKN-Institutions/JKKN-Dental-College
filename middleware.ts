import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // 🎨 TESTING MODE: All authentication disabled for testing purposes
  // This allows direct access to all routes including admin dashboard
  console.log('🎨 [TESTING MODE] Authentication disabled - allowing all access')
  return NextResponse.next()
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
