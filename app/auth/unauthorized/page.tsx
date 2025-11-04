'use client'

import Link from 'next/link'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-white to-yellow-50/30">
      <div className="w-full max-w-md p-8">
        {/* Warning Icon */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-yellow-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You don't have permission to access the admin panel
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm font-medium text-yellow-800 mb-2">
              Insufficient Permissions
            </p>
            <p className="text-sm text-yellow-700">
              This area is restricted to authorized administrators only.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Access Requirements:</h3>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
              <li>Your account must have an <strong>Admin</strong> or <strong>Super Admin</strong> role</li>
              <li>Your account status must be <strong>Active</strong> (not blocked)</li>
              <li>Contact an administrator to request access</li>
            </ul>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> If you believe you should have access, please contact a super administrator to review your account permissions.
            </p>
          </div>

          <div className="mt-8 space-y-3">
            <Link
              href="/"
              className="block w-full text-center bg-primary-green text-white font-semibold py-3 px-4 rounded-lg hover:bg-primary-green/90 transition-all duration-200"
            >
              Return to Homepage
            </Link>
            <Link
              href="/auth/login"
              className="block w-full text-center border-2 border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              Try with Different Account
            </Link>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Access is controlled by role-based permissions
          </p>
        </div>
      </div>
    </div>
  )
}
