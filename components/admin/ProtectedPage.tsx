'use client'

import { usePermissions } from '@/lib/permissions'
import type { PermissionModule, PermissionAction } from '@/lib/permissions'
import { Loader2, ShieldAlert, Lock } from 'lucide-react'
import Link from 'next/link'

interface ProtectedPageProps {
  /** The module to check permission for */
  module: PermissionModule
  /** The action to check (defaults to 'view') */
  action?: PermissionAction
  /** The content to render if user has permission */
  children: React.ReactNode
  /** Custom fallback component for access denied */
  fallback?: React.ReactNode
  /** Show loading spinner while checking permissions */
  showLoading?: boolean
}

/**
 * ProtectedPage Component
 *
 * Wraps page content and checks if the user has permission to access it.
 * Shows loading state while checking, and access denied message if no permission.
 *
 * @example
 * ```tsx
 * export default function UsersPage() {
 *   return (
 *     <ProtectedPage module="users" action="view">
 *       <div>Users content here</div>
 *     </ProtectedPage>
 *   )
 * }
 * ```
 */
export function ProtectedPage({
  module,
  action = 'view',
  children,
  fallback,
  showLoading = true
}: ProtectedPageProps) {
  const { hasPermission, loading, profile } = usePermissions()

  // Show loading state while permissions are being checked
  if (loading && showLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-green animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Verifying permissions...</p>
        </div>
      </div>
    )
  }

  // Check if user has the required permission
  const allowed = hasPermission(module, action)

  // If not allowed, show access denied message or custom fallback
  if (!allowed) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md px-4">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Access Denied
            </h2>
            <p className="text-gray-600 mb-6">
              You don't have permission to access this page.
              {profile?.role_type === 'custom_role' && (
                <span className="block mt-2 text-sm">
                  Required permission: <span className="font-semibold">{module}.{action}</span>
                </span>
              )}
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3 text-left">
              <Lock className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700">
                <p className="font-medium mb-1">Why am I seeing this?</p>
                <p className="text-gray-600">
                  Your current role doesn't include the necessary permissions to view or modify this content.
                  Contact your administrator to request access.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Link
              href="/admin/dashboard"
              className="px-4 py-2 bg-primary-green text-white rounded-lg hover:bg-primary-green/90 transition-colors"
            >
              Go to Dashboard
            </Link>
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  // If allowed, render the protected content
  return <>{children}</>
}

/**
 * Higher-Order Component version of ProtectedPage
 *
 * Wraps a component and adds permission checking
 *
 * @example
 * ```tsx
 * const ProtectedUsersPage = withProtectedPage(UsersPage, 'users', 'view')
 * export default ProtectedUsersPage
 * ```
 */
export function withProtectedPage<P extends object>(
  Component: React.ComponentType<P>,
  module: PermissionModule,
  action: PermissionAction = 'view'
) {
  return function ProtectedComponent(props: P) {
    return (
      <ProtectedPage module={module} action={action}>
        <Component {...props} />
      </ProtectedPage>
    )
  }
}
