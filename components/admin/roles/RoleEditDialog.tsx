/**
 * RoleEditDialog Component
 * Modal for editing role permissions
 */

'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { PermissionMatrix } from './PermissionMatrix'
import { updateRole, getRoleById } from '@/actions/roles'
import {
  updateRoleSchema,
  type UpdateRoleInput,
  type Permissions,
} from '@/lib/validations/role'
import { Loader2, Save } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface RoleEditDialogProps {
  roleId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function RoleEditDialog({ roleId, open, onOpenChange, onSuccess }: RoleEditDialogProps) {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [permissions, setPermissions] = useState<Permissions>({})

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateRoleInput>({
    resolver: zodResolver(updateRoleSchema),
  })

  useEffect(() => {
    if (open && roleId) {
      loadRole()
    } else if (!open) {
      reset()
      setPermissions({})
    }
  }, [open, roleId])

  const loadRole = async () => {
    if (!roleId) return

    setLoading(true)
    const result = await getRoleById(roleId)

    if (result.success) {
      const role = result.data
      reset({
        name: role.name,
        description: role.description || '',
        permissions: role.permissions,
      })
      setPermissions(role.permissions || {})
    } else {
      toast.error('Failed to load role')
      onOpenChange(false)
    }

    setLoading(false)
  }

  const onSubmit = async (data: UpdateRoleInput) => {
    if (!roleId) return

    setSaving(true)

    const roleData: UpdateRoleInput = {
      ...data,
      permissions,
    }

    const result = await updateRole(roleId, roleData)

    if (result.success) {
      toast.success('Role updated successfully')
      onOpenChange(false)
      onSuccess?.()
    } else {
      toast.error(result.error || 'Failed to update role')
    }

    setSaving(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Role</DialogTitle>
          <DialogDescription>
            Modify role name, description, and permissions
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">
                  Role Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-name"
                  placeholder="e.g., Video Editor"
                  {...register('name')}
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  placeholder="Describe what this role can do..."
                  rows={3}
                  {...register('description')}
                />
                {errors.description && (
                  <p className="text-xs text-red-500">{errors.description.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>
                Permissions <span className="text-red-500">*</span>
              </Label>
              <PermissionMatrix value={permissions} onChange={setPermissions} />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
