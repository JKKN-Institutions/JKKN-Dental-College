/**
 * RoleCreateDialog Component
 * Modal for creating new custom roles with permission matrix
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
import { Textarea } from '@/components/ui/textarea'
import { PermissionMatrix } from './PermissionMatrix'
import { createRole } from '@/actions/roles'
import {
  createRoleSchema,
  type CreateRoleInput,
  type Permissions,
} from '@/lib/validations/role'
import { Loader2, Save } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface RoleCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function RoleCreateDialog({ open, onOpenChange, onSuccess }: RoleCreateDialogProps) {
  const [saving, setSaving] = useState(false)
  const [permissions, setPermissions] = useState<Permissions>({
    dashboard: { view: true },
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateRoleInput>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      name: '',
      description: '',
      permissions: permissions,
    },
  })

  const onSubmit = async (data: CreateRoleInput) => {
    setSaving(true)

    // Include permissions from state
    const roleData: CreateRoleInput = {
      ...data,
      permissions,
    }

    const result = await createRole(roleData)

    if (result.success) {
      toast.success('Role created successfully')
      reset()
      setPermissions({ dashboard: { view: true } })
      onOpenChange(false)
      onSuccess?.()
    } else {
      toast.error(result.error || 'Failed to create role')
    }

    setSaving(false)
  }

  const handleClose = () => {
    if (!saving) {
      reset()
      setPermissions({ dashboard: { view: true } })
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Custom Role</DialogTitle>
          <DialogDescription>
            Create a new custom role with specific permissions
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Role Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g., Video Editor"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what this role can do..."
                rows={3}
                {...register('description')}
              />
              {errors.description && (
                <p className="text-xs text-red-500">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Permissions Matrix */}
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
                  <Save className="w-4 h-4 mr-2" />
                  Create Role
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
