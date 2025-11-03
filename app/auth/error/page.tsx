'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-50/30">
      <div className="w-full max-w-md p-8">
        {/* Error Icon */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Authentication Error
          </h1>
          <p className="text-gray-600">
            We encountered an issue signing you in
          </p>
        </div>

        {/* Error Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm font-medium text-red-800 mb-1">
              {error || 'Authentication failed'}
            </p>
            {errorDescription && (
              <p className="text-sm text-red-600">{errorDescription}</p>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Common Issues:</h3>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
              <li>Make sure you're using your @jkkn.ac.in email address</li>
              <li>Check if you have a stable internet connection</li>
              <li>Try clearing your browser cache and cookies</li>
              <li>Ensure pop-ups are not blocked for this site</li>
            </ul>
          </div>

          <div className="mt-8 space-y-3">
            <Link
              href="/auth/login"
              className="block w-full text-center bg-primary-green text-white font-semibold py-3 px-4 rounded-lg hover:bg-primary-green/90 transition-all duration-200"
            >
              Try Again
            </Link>
            <Link
              href="/"
              className="block w-full text-center border-2 border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              Go to Homepage
            </Link>
          </div>
        </div>

        {/* Support Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-2">
            Still having trouble?
          </p>
          <a
            href="/contact"
            className="text-sm text-primary-green hover:underline font-medium"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  )
}
