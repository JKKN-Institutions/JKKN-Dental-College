/**
 * UserEditDialog Component
 * Modal dialog for editing user information, role, and status
 */

'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UserRoleSelector } from './UserRoleSelector'
import { UserStatusBadge } from './UserStatusBadge'
import { updateUser, updateUserRole, updateUserStatus, getUserById } from '@/actions/users'
import { Loader2, Save, User, Shield, Activity } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'

// Form schemas
const profileFormSchema = z.object({
  full_name: z.string().min(2).max(100).optional(),
  designation: z.string().max(100).optional().nullable(),
  institution_id: z.string().uuid().optional().nullable(),
  department_id: z.string().uuid().optional().nullable(),
  phone: z.string().regex(/^[0-9]{10}$/).optional().nullable().or(z.literal('')),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

interface UserEditDialogProps {
  userId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function UserEditDialog({ userId, open, onOpenChange, onSuccess }: UserEditDialogProps) {
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')

  // Institution and department data
  const [institutions, setInstitutions] = useState<Array<{ id: string; name: string }>>([])
  const [departments, setDepartments] = useState<Array<{ id: string; name: string; institution_id: string }>>([])
  const [selectedInstitutionId, setSelectedInstitutionId] = useState<string | null>(null)

  // Form state for profile
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
  })

  // Watch institution_id changes
  const institutionId = watch('institution_id')

  // Form state for role
  const [roleData, setRoleData] = useState<{
    role_type: 'user' | 'custom_role' | 'super_admin'
    role_id: string | null
  }>({ role_type: 'user', role_id: null })

  // Form state for status
  const [statusData, setStatusData] = useState<'active' | 'blocked' | 'pending'>('active')

  // Fetch institutions and departments
  useEffect(() => {
    if (open) {
      fetchInstitutions()
      fetchDepartments()
    }
  }, [open])

  // Load user data when dialog opens
  useEffect(() => {
    if (open && userId) {
      loadUserData()
    } else if (!open) {
      // Reset form when dialog closes
      reset()
      setUserData(null)
      setActiveTab('profile')
      setSelectedInstitutionId(null)
    }
  }, [open, userId])

  // Filter departments when institution changes
  useEffect(() => {
    if (institutionId) {
      setSelectedInstitutionId(institutionId)
    } else {
      setSelectedInstitutionId(null)
      setValue('department_id', null)
    }
  }, [institutionId, setValue])

  const fetchInstitutions = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('institutions')
        .select('id, name')
        .order('name', { ascending: true })

      if (error) throw error
      setInstitutions(data || [])
    } catch (error) {
      console.error('Failed to fetch institutions:', error)
    }
  }

  const fetchDepartments = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('departments')
        .select('id, name, institution_id')
        .order('name', { ascending: true })

      if (error) throw error
      setDepartments(data || [])
    } catch (error) {
      console.error('Failed to fetch departments:', error)
    }
  }

  const loadUserData = async () => {
    if (!userId) return

    setLoading(true)
    const result = await getUserById(userId)

    if (result.success) {
      const user = result.data
      setUserData(user)

      // Set form values
      reset({
        full_name: user.full_name || '',
        designation: user.designation || '',
        institution_id: user.institution_id || null,
        department_id: user.department_id || null,
        phone: user.phone || '',
      })

      setSelectedInstitutionId(user.institution_id || null)

      setRoleData({
        role_type: user.role_type,
        role_id: user.role_id,
      })

      setStatusData(user.status)
    } else {
      toast.error('Failed to load user data')
      onOpenChange(false)
    }

    setLoading(false)
  }

  const onSubmitProfile = async (data: ProfileFormValues) => {
    if (!userId) return

    setSaving(true)
    const result = await updateUser(userId, data)

    if (result.success) {
      toast.success('Profile updated successfully')
      onSuccess?.()
      loadUserData() // Reload data
    } else {
      toast.error(result.error || 'Failed to update profile')
    }

    setSaving(false)
  }

  const onSubmitRole = async () => {
    if (!userId) return

    setSaving(true)
    const result = await updateUserRole(userId, roleData)

    if (result.success) {
      toast.success('Role updated successfully')
      onSuccess?.()
      loadUserData() // Reload data
    } else {
      toast.error(result.error || 'Failed to update role')
    }

    setSaving(false)
  }

  const onSubmitStatus = async () => {
    if (!userId) return

    setSaving(true)
    const result = await updateUserStatus(userId, { status: statusData })

    if (result.success) {
      toast.success('Status updated successfully')
      onSuccess?.()
      loadUserData() // Reload data
    } else {
      toast.error(result.error || 'Failed to update status')
    }

    setSaving(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user information, role assignment, and account status
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : userData ? (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">
                <User className="w-4 h-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="role">
                <Shield className="w-4 h-4 mr-2" />
                Role
              </TabsTrigger>
              <TabsTrigger value="status">
                <Activity className="w-4 h-4 mr-2" />
                Status
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={userData.email} disabled />
                  <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input id="full_name" {...register('full_name')} />
                  {errors.full_name && (
                    <p className="text-xs text-red-500">{errors.full_name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="designation">Designation</Label>
                  <Input id="designation" {...register('designation')} />
                  {errors.designation && (
                    <p className="text-xs text-red-500">{errors.designation.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="institution_id">Institution</Label>
                    <Select
                      value={watch('institution_id') || 'none'}
                      onValueChange={(value) => setValue('institution_id', value === 'none' ? null : value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select institution" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Institution</SelectItem>
                        {institutions.map((institution) => (
                          <SelectItem key={institution.id} value={institution.id}>
                            {institution.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.institution_id && (
                      <p className="text-xs text-red-500">{errors.institution_id.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department_id">Department</Label>
                    <Select
                      value={watch('department_id') || 'none'}
                      onValueChange={(value) => setValue('department_id', value === 'none' ? null : value)}
                      disabled={!selectedInstitutionId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={selectedInstitutionId ? "Select department" : "Select institution first"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Department</SelectItem>
                        {departments
                          .filter((dept) => dept.institution_id === selectedInstitutionId)
                          .map((department) => (
                            <SelectItem key={department.id} value={department.id}>
                              {department.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    {errors.department_id && (
                      <p className="text-xs text-red-500">{errors.department_id.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" {...register('phone')} placeholder="10 digits" />
                  {errors.phone && (
                    <p className="text-xs text-red-500">{errors.phone.message}</p>
                  )}
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
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
            </TabsContent>

            {/* Role Tab */}
            <TabsContent value="role">
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Current Role:</p>
                  <p className="font-medium">
                    {userData.roles?.name ||
                     (userData.role_type === 'super_admin' ? 'Super Admin' : 'User')}
                  </p>
                </div>

                <UserRoleSelector
                  value={roleData}
                  onChange={setRoleData}
                  label="Assign New Role"
                />

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                  <Button onClick={onSubmitRole} disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Update Role
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </div>
            </TabsContent>

            {/* Status Tab */}
            <TabsContent value="status">
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Current Status:</p>
                  <UserStatusBadge status={userData.status} />
                </div>

                <div className="space-y-2">
                  <Label>Change Status</Label>
                  <Select value={statusData} onValueChange={(value: any) => setStatusData(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          Active - User can access admin panel
                        </div>
                      </SelectItem>
                      <SelectItem value="pending">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                          Pending - Awaiting approval
                        </div>
                      </SelectItem>
                      <SelectItem value="blocked">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          Blocked - Access denied
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                  <Button onClick={onSubmitStatus} disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Update Status
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </div>
            </TabsContent>
          </Tabs>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
