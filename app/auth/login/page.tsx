'use client'

import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()

  const handleLogin = () => {
    // For testing: directly navigate to admin dashboard
    router.push('/admin/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-green/5 via-white to-primary-cream/30">
      <div className="w-full max-w-md p-8">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-primary-green rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">JKKN</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to JKKN Institution
          </h1>
          <p className="text-gray-600">
            Sign in with your Google account
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <button
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-3 bg-primary-green hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200"
          >
            <span>Go to Admin Dashboard</span>
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Testing Mode - Authentication Disabled
            </p>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}
