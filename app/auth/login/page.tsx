'use client'

import { useRouter } from 'next/navigation'
import { FcGoogle } from 'react-icons/fc'

export default function AdminLoginPage() {
  const router = useRouter()

  const handleGoogleLogin = () => {
    // For testing: directly navigate to admin dashboard
    // In production, this will use Supabase Google OAuth
    router.push('/admin/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-green/5 via-white to-primary-cream/30">
      <div className="w-full max-w-md p-8">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-primary-green rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">JKKN</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Portal
          </h1>
          <p className="text-gray-600">
            Sign in with your JKKN Google account
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Only @jkkn.ac.in email addresses are allowed
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-all duration-200 border-2 border-gray-300 hover:border-primary-green"
          >
            <FcGoogle className="text-2xl" />
            <span>Sign in with Google</span>
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Testing Mode - Authentication Disabled
            </p>
          </div>

          {/* Admin Access Notice */}
          <div className="mt-6 p-4 bg-primary-green/5 rounded-lg border border-primary-green/20">
            <p className="text-xs text-gray-600 text-center">
              <span className="font-semibold text-primary-green">Admin Access Only:</span> This portal is restricted to authorized JKKN staff and administrators.
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
