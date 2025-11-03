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
            You don't have permission to access this site
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm font-medium text-yellow-800 mb-2">
              Email Domain Not Allowed
            </p>
            <p className="text-sm text-yellow-700">
              This website is only accessible to users with @jkkn.ac.in email addresses.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Required:</h3>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
              <li>You must be a student, faculty, or staff member</li>
              <li>You must use your official @jkkn.ac.in email address</li>
              <li>Your account must be registered with the institution</li>
            </ul>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> If you believe this is an error and you have a valid @jkkn.ac.in email address, please contact the IT administrator.
            </p>
          </div>

          <div className="mt-8 space-y-3">
            <Link
              href="/auth/login"
              className="block w-full text-center bg-primary-green text-white font-semibold py-3 px-4 rounded-lg hover:bg-primary-green/90 transition-all duration-200"
            >
              Try with Different Account
            </Link>
            <a
              href="mailto:support@jkkn.ac.in"
              className="block w-full text-center border-2 border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              Contact Support
            </a>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            This is a private institutional website
          </p>
        </div>
      </div>
    </div>
  )
}
