/**
 * Invitation Acceptance Page
 * Allows users to accept their invitation and get instructions
 */

'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { getInvitationByToken, acceptInvitation } from '@/actions/users'
import { Loader2, CheckCircle, XCircle, Mail, Calendar, User, Shield } from 'lucide-react'
import Link from 'next/link'

export default function InviteAcceptPage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string

  const [loading, setLoading] = useState(true)
  const [accepting, setAccepting] = useState(false)
  const [invitation, setInvitation] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [accepted, setAccepted] = useState(false)

  useEffect(() => {
    if (token) {
      loadInvitation()
    }
  }, [token])

  const loadInvitation = async () => {
    setLoading(true)
    const result = await getInvitationByToken(token)

    if (result.success) {
      setInvitation(result.data)
      setError(null)
    } else {
      setError(result.error || 'Invalid invitation')
    }

    setLoading(false)
  }

  const handleAccept = async () => {
    setAccepting(true)

    const result = await acceptInvitation(token, '')

    if (result.success) {
      setAccepted(true)
    } else {
      setError(result.error || 'Failed to accept invitation')
    }

    setAccepting(false)
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'long',
      timeStyle: 'short',
    }).format(new Date(dateString))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading invitation...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <CardTitle className="text-center">Invalid Invitation</CardTitle>
            <CardDescription className="text-center">{error}</CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Link href="/auth/login">
              <Button variant="outline">Go to Login</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (accepted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle className="text-center">Invitation Accepted!</CardTitle>
            <CardDescription className="text-center">
              Your account has been set up successfully
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Next Step:</strong> Sign in using Google OAuth with your{' '}
                <strong>{invitation.email}</strong> account.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{invitation.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{invitation.full_name}</span>
              </div>
              {invitation.role_name && (
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Role: {invitation.role_name}</span>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="justify-center">
            <Link href="/auth/login">
              <Button>Continue to Login</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-green/10 mx-auto mb-4">
            <Mail className="w-6 h-6 text-primary-green" />
          </div>
          <CardTitle className="text-center">You're Invited!</CardTitle>
          <CardDescription className="text-center">
            Join JKKN Dental College Admin Panel
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Email</p>
              <p className="font-medium">{invitation.email}</p>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Full Name</p>
              <p className="font-medium">{invitation.full_name || 'Not provided'}</p>
            </div>

            {invitation.department && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Department</p>
                <p className="font-medium">{invitation.department}</p>
              </div>
            )}

            {invitation.designation && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Designation</p>
                <p className="font-medium">{invitation.designation}</p>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Expires: {formatDate(invitation.expires_at)}</span>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              By accepting this invitation, you'll be able to sign in to the JKKN Admin
              Panel using your @jkkn.ac.in Google account.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Link href="/auth/login" className="flex-1">
            <Button variant="outline" className="w-full" disabled={accepting}>
              Decline
            </Button>
          </Link>
          <Button className="flex-1" onClick={handleAccept} disabled={accepting}>
            {accepting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Accepting...
              </>
            ) : (
              'Accept Invitation'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
