/**
 * RoleDeleteDialog Component
 * Confirmation dialog for deleting roles with user count check
 */

'use client'

import { useState, useEffect } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { deleteRole, getRoleById, getRoleUserCount } from '@/actions/roles'
import { Loader2, AlertTriangle } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface RoleDeleteDialogProps {
  roleId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function RoleDeleteDialog({
  roleId,
  open,
  onOpenChange,
  onSuccess,
}: RoleDeleteDialogProps) {
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [roleName, setRoleName] = useState('')
  const [userCount, setUserCount] = useState(0)

  useEffect(() => {
    if (open && roleId) {
      loadRoleInfo()
    }
  }, [open, roleId])

  const loadRoleInfo = async () => {
    if (!roleId) return

    setLoading(true)

    const [roleResult, countResult] = await Promise.all([
      getRoleById(roleId),
      getRoleUserCount(roleId),
    ])

    if (roleResult.success) {
      setRoleName(roleResult.data.name)
    }

    if (countResult.success) {
      setUserCount(countResult.data)
    }

    setLoading(false)
  }

  const handleDelete = async () => {
    if (!roleId) return

    setDeleting(true)

    const result = await deleteRole(roleId)

    if (result.success) {
      toast.success('Role deleted successfully')
      onOpenChange(false)
      onSuccess?.()
    } else {
      toast.error(result.error || 'Failed to delete role')
    }

    setDeleting(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Delete Role
          </AlertDialogTitle>
          <AlertDialogDescription>
            {loading ? (
              <div className="flex items-center gap-2 py-4">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading role information...
              </div>
            ) : userCount > 0 ? (
              <div className="space-y-2">
                <p className="font-medium text-red-600">
                  Cannot delete this role
                </p>
                <p>
                  <strong>{userCount}</strong> user{userCount !== 1 ? 's are' : ' is'}{' '}
                  currently assigned to <strong>{roleName}</strong>.
                </p>
                <p>
                  Please reassign {userCount !== 1 ? 'these users' : 'this user'} to a
                  different role before deleting.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <p>
                  Are you sure you want to delete <strong>{roleName}</strong>?
                </p>
                <p className="text-sm">
                  This action cannot be undone. All permissions associated with this role
                  will be removed.
                </p>
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {userCount > 0 ? (
            <AlertDialogAction onClick={() => onOpenChange(false)}>
              OK
            </AlertDialogAction>
          ) : (
            <>
              <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={deleting || loading}
                className="bg-red-600 hover:bg-red-700"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete Role'
                )}
              </AlertDialogAction>
            </>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
