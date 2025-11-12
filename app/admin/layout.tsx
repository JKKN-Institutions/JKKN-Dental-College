'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { MobileBottomNav } from '@/components/admin/MobileBottomNav'
import { Toaster } from 'react-hot-toast'
import { Loader2, ShieldAlert } from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  // Memoize callbacks to prevent unnecessary re-renders
  const handleMobileMenuOpen = useCallback(() => {
    setIsMobileSidebarOpen(true)
  }, [])

  const handleMobileMenuClose = useCallback(() => {
    setIsMobileSidebarOpen(false)
  }, [])

  useEffect(() => {
    checkAdminAccess()
  }, [])

  const checkAdminAccess = async () => {
    try {
      const supabase = createClient()

      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError || !user) {
        console.log('[ADMIN LAYOUT] No authenticated user')
        // Redirect immediately to login
        router.replace('/auth/login')
        return
      }

      console.log('[ADMIN LAYOUT] Checking access for user:', user.email)

      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role_type, status')
        .eq('id', user.id)
        .maybeSingle()

      if (profileError) {
        console.error('[ADMIN LAYOUT] Error fetching profile:', profileError)
        setAuthError('Failed to verify permissions')
        setIsChecking(false)
        // Redirect immediately
        router.replace('/auth/unauthorized')
        return
      }

      if (!profile) {
        console.log('[ADMIN LAYOUT] No profile found')
        setAuthError('User profile not found')
        setIsChecking(false)
        // Redirect immediately
        router.replace('/auth/unauthorized')
        return
      }

      // Check if user has admin access (super_admin or custom_role)
      const allowedRoleTypes = ['super_admin', 'custom_role']
      if (allowedRoleTypes.includes(profile.role_type) && profile.status === 'active') {
        console.log('[ADMIN LAYOUT] ✅ Admin access verified for:', user.email, 'Role:', profile.role_type)
        setIsAuthorized(true)
        setIsChecking(false)
        return
      }

      // For regular users or inactive accounts - DENY ACCESS
      console.log('[ADMIN LAYOUT] ❌ Access DENIED for user:', user.email, 'Role:', profile.role_type)
      console.log('[ADMIN LAYOUT] Allowed roles: super_admin, custom_role. User has:', profile.role_type)

      setAuthError('Access Denied: Insufficient permissions to access admin area')
      setIsChecking(false)

      // Redirect immediately to unauthorized page
      router.replace('/auth/unauthorized')

    } catch (error) {
      console.error('[ADMIN LAYOUT] Unexpected error:', error)
      setAuthError('An unexpected error occurred')
      setIsChecking(false)
      router.replace('/auth/unauthorized')
    }
  }

  // Show loading state while checking authentication
  if (isChecking) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-green animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Verifying your access...
          </h2>
          <p className="text-gray-600">
            Please wait while we check your permissions
          </p>
        </div>
      </div>
    )
  }

  // Show minimal error state while redirecting (user should not see this for long)
  if (!isAuthorized) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-4">
          <Loader2 className="w-12 h-12 text-gray-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">
            Redirecting...
          </p>
        </div>
      </div>
    )
  }

  // Render admin layout only if authorized
  console.log('[ADMIN LAYOUT] Rendering authorized layout')

  return (
    <div className="fixed inset-0 flex bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar - Hidden on mobile - Fixed position */}
      <AdminSidebar
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={handleMobileMenuClose}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header - Fixed at top */}
        <AdminHeader onMenuClick={handleMobileMenuOpen} />

        {/* Page Content - Scrollable area only */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50">
          <div className="p-4 md:p-6 pb-20 lg:pb-6">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation - Fixed at bottom */}
      <MobileBottomNav onMenuClick={handleMobileMenuOpen} />

      {/* Toast Notifications */}
      <Toaster />
    </div>
  )
}
