'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { FcGoogle } from 'react-icons/fc'
import Image from 'next/image'

export default function AdminLoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const supabase = createClient()
      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/admin/dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
            hd: 'jkkn.ac.in', // Restrict to @jkkn.ac.in domain
          },
        },
      })

      if (signInError) {
        console.error('Sign in error:', signInError)
        setError(signInError.message)
        setIsLoading(false)
      }
      // If successful, user will be redirected to Google OAuth
    } catch (err) {
      console.error('Unexpected error:', err)
      setError('An unexpected error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f5f3ed] via-[#ebe8dc] to-[#e8e5d9] relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8),transparent_50%)]"></div>
      </div>

      <div className="w-full max-w-[500px] p-6 relative z-10">
        {/* Login Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-12 border border-white/50">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative w-32 h-32">
              <Image
                src="/images/jkkn logo.png"
                alt="JKKN Institution Logo"
                fill
                className="object-contain drop-shadow-lg"
                priority
              />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-[32px] font-bold text-emerald-700 mb-3 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-[15px] text-gray-600 font-medium">
              Continue with Google
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
              <p className="text-sm text-red-600 text-center font-medium">{error}</p>
            </div>
          )}

          {/* Continue with Google Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-4 px-6 rounded-2xl transition-all duration-200 border-2 border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed mb-8 group"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-gray-300 border-t-emerald-600 rounded-full animate-spin" />
                <span className="text-[15px]">Signing in...</span>
              </>
            ) : (
              <>
                <FcGoogle className="text-2xl" />
                <span className="text-[15px]">Continue with Google</span>
              </>
            )}
          </button>

          {/* Admin Access Notice */}
          <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <div>
                <p className="text-xs text-gray-800 font-bold mb-1">
                  Admin Access Only
                </p>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  Only @jkkn.ac.in email addresses. All activities are monitored and logged.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
