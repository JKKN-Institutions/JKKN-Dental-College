/**
 * UserCreateDialog Component
 * Modal for creating new users or sending invitations
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UserRoleSelector } from './UserRoleSelector'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createUser, sendUserInvitation } from '@/actions/users'
import { createUserSchema, type CreateUserInput } from '@/lib/validations/user'
import { Loader2, Save, Mail, Copy, CheckCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface UserCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function UserCreateDialog({ open, onOpenChange, onSuccess }: UserCreateDialogProps) {
  const [saving, setSaving] = useState(false)
  const [inviteLink, setInviteLink] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('invite')

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
      department: '',
      employee_id: '',
      phone: '',
      role_type: 'user' as const,
      role_id: null as string | null,
      status: 'pending' as const,
    },
  })

  const roleType = watch('role_type') as 'user' | 'custom_role'
  const roleId = watch('role_id') as string | null

  const handleClose = () => {
    if (!saving) {
      reset()
      setInviteLink(null)
      setActiveTab('invite')
      onOpenChange(false)
    }
  }

  const onSubmitInvite = async (data: CreateUserInput) => {
    setSaving(true)

    const result = await sendUserInvitation(data)

    if (result.success) {
      toast.success('Invitation sent successfully!')
      setInviteLink(result.data.inviteLink)
      onSuccess?.()
    } else {
      toast.error(result.error || 'Failed to send invitation')
    }

    setSaving(false)
  }

  const onSubmitDirect = async (data: CreateUserInput) => {
    setSaving(true)

    // For direct creation, set status to active
    const userData = { ...data, status: 'active' as const }

    const result = await createUser(userData)

    if (result.success) {
      toast.success('User created successfully!')
      reset()
      setInviteLink(null)
      onOpenChange(false)
      onSuccess?.()
    } else {
      toast.error(result.error || 'Failed to create user')
    }

    setSaving(false)
  }

  const copyInviteLink = () => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink)
      toast.success('Invite link copied to clipboard!')
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Create a new user account or send an invitation email
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="invite">
              <Mail className="w-4 h-4 mr-2" />
              Send Invitation
            </TabsTrigger>
            <TabsTrigger value="direct">
              <Save className="w-4 h-4 mr-2" />
              Direct Creation
            </TabsTrigger>
          </TabsList>

          {/* Send Invitation Tab */}
          <TabsContent value="invite">
            {inviteLink ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p className="text-sm text-green-800">
                    Invitation created successfully!
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Invitation Link</Label>
                  <div className="flex gap-2">
                    <Input value={inviteLink} readOnly className="font-mono text-sm" />
                    <Button type="button" onClick={copyInviteLink} size="sm">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Share this link with the user. It will expire in 7 days.
                  </p>
                </div>

                <DialogFooter>
                  <Button onClick={handleClose}>Done</Button>
                </DialogFooter>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmitInvite)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
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
                    <Input id="full_name" {...register('full_name')} />
                    {errors.full_name && (
                      <p className="text-xs text-red-500">{errors.full_name.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="designation">Designation</Label>
                    <Input id="designation" {...register('designation')} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input id="department" {...register('department')} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employee_id">Employee ID</Label>
                    <Input id="employee_id" {...register('employee_id')} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" placeholder="10 digits" {...register('phone')} />
                    {errors.phone && (
                      <p className="text-xs text-red-500">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

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
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Send Invitation
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </TabsContent>

          {/* Direct Creation Tab */}
          <TabsContent value="direct">
            <form onSubmit={handleSubmit(onSubmitDirect)} className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> The user will be created immediately with active
                  status. They can sign in using Google OAuth with their @jkkn.ac.in email.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="direct-email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="direct-email"
                    type="email"
                    placeholder="user@jkkn.ac.in"
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="direct-full_name">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input id="direct-full_name" {...register('full_name')} />
                  {errors.full_name && (
                    <p className="text-xs text-red-500">{errors.full_name.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="direct-designation">Designation</Label>
                  <Input id="direct-designation" {...register('designation')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="direct-department">Department</Label>
                  <Input id="direct-department" {...register('department')} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="direct-employee_id">Employee ID</Label>
                  <Input id="direct-employee_id" {...register('employee_id')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="direct-phone">Phone</Label>
                  <Input id="direct-phone" placeholder="10 digits" {...register('phone')} />
                  {errors.phone && (
                    <p className="text-xs text-red-500">{errors.phone.message}</p>
                  )}
                </div>
              </div>

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
                      Create User
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
