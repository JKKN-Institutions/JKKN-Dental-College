/**
 * UserCreateDialog Component
 * Modal for creating new users
 */

'use client'

import { useState } from 'react'
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
import { UserRoleSelector } from './UserRoleSelector'
import { InstitutionSelector } from './InstitutionSelector'
import { DepartmentSelector } from './DepartmentSelector'
import { createUser } from '@/actions/users'
import { createUserSchema, type CreateUserInput } from '@/lib/validations/user'
import { Loader2, UserPlus } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface UserCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function UserCreateDialog({ open, onOpenChange, onSuccess }: UserCreateDialogProps) {
  const [saving, setSaving] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: '',
      full_name: '',
      designation: '',
      institution_id: null as string | null,
      department_id: null as string | null,
      phone: '',
      role_type: 'user' as const,
      role_id: null as string | null,
      status: 'pending' as const,
    },
  })

  const roleType = watch('role_type') as 'user' | 'custom_role'
  const roleId = watch('role_id') as string | null
  const institutionId = watch('institution_id') as string | null
  const departmentId = watch('department_id') as string | null

  const handleClose = () => {
    if (!saving) {
      reset()
      onOpenChange(false)
    }
  }

  const onSubmit = async (data: CreateUserInput) => {
    setSaving(true)

    // Set status to active for direct creation
    const userData = { ...data, status: 'active' as const }

    const result = await createUser(userData)

    if (result.success) {
      toast.success(result.data?.message || 'User created successfully!')
      reset()
      onOpenChange(false)
      onSuccess?.()
    } else {
      toast.error(result.error || 'Failed to create user')
    }

    setSaving(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Create a new user account. They can sign in using Google OAuth with their @jkkn.ac.in email.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Basic Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@jkkn.ac.in"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="full_name">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="full_name"
                  placeholder="Enter full name"
                  {...register('full_name')}
                />
                {errors.full_name && (
                  <p className="text-xs text-red-500">{errors.full_name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="10 digits"
                  {...register('phone')}
                />
                {errors.phone && (
                  <p className="text-xs text-red-500">{errors.phone.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Organization Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Organization Details</h3>
            <div className="grid grid-cols-1 gap-4">
              <InstitutionSelector
                value={institutionId}
                onChange={(value) => {
                  setValue('institution_id', value)
                  setValue('department_id', null)
                }}
                label="Institution"
              />

              <DepartmentSelector
                value={departmentId}
                onChange={(value) => setValue('department_id', value)}
                institutionId={institutionId}
                label="Department"
              />

              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Input
                  id="designation"
                  placeholder="e.g., Professor, HOD, Lecturer"
                  {...register('designation')}
                />
              </div>
            </div>
          </div>

          {/* Role Assignment */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Role & Permissions</h3>
            <UserRoleSelector
              value={{ role_type: roleType as 'user' | 'custom_role', role_id: roleId ?? null }}
              onChange={(value) => {
                if (value.role_type !== 'super_admin') {
                  setValue('role_type', value.role_type)
                  setValue('role_id', value.role_id)
                }
              }}
              label="Assign Role"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create User
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
