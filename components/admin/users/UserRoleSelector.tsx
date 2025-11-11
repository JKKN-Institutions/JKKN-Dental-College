/**
 * UserRoleSelector Component
 * Dropdown for selecting and assigning user roles
 */

'use client'

import { useState, useEffect } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { getAvailableRoles } from '@/actions/users'
import { Loader2 } from 'lucide-react'

interface Role {
  id: string
  name: string
  description: string | null
  is_system_role: boolean
}

interface UserRoleSelectorProps {
  value?: {
    role_type: 'user' | 'custom_role' | 'super_admin'
    role_id: string | null
  }
  onChange: (value: {
    role_type: 'user' | 'custom_role' | 'super_admin'
    role_id: string | null
  }) => void
  disabled?: boolean
  label?: string
}

export function UserRoleSelector({
  value,
  onChange,
  disabled,
  label = 'Role',
}: UserRoleSelectorProps) {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRoles()
  }, [])

  const loadRoles = async () => {
    setLoading(true)
    const result = await getAvailableRoles()
    if (result.success) {
      setRoles(result.data)
    }
    setLoading(false)
  }

  const handleChange = (selectedValue: string) => {
    if (selectedValue === 'user') {
      onChange({ role_type: 'user', role_id: null })
    } else if (selectedValue === 'super_admin') {
      onChange({ role_type: 'super_admin', role_id: null })
    } else {
      // Custom role selected
      const role = roles.find((r) => r.id === selectedValue)
      if (role) {
        onChange({ role_type: 'custom_role', role_id: role.id })
      }
    }
  }

  const getCurrentValue = () => {
    if (!value) return 'user'

    if (value.role_type === 'super_admin') return 'super_admin'
    if (value.role_type === 'user') return 'user'
    if (value.role_type === 'custom_role' && value.role_id) {
      return value.role_id
    }

    return 'user'
  }

  if (loading) {
    return (
      <div className="space-y-2">
        {label && <Label>{label}</Label>}
        <div className="flex items-center gap-2 px-3 py-2 border rounded-md bg-muted">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm text-muted-foreground">Loading roles...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <Select value={getCurrentValue()} onValueChange={handleChange} disabled={disabled}>
        <SelectTrigger>
          <SelectValue placeholder="Select a role" />
        </SelectTrigger>
        <SelectContent className="max-h-[400px] overflow-y-auto">
          {/* Default roles */}
          <SelectItem value="user">
            <div className="flex flex-col items-start">
              <span>User</span>
              <span className="text-xs text-muted-foreground">
                Regular user with no admin access
              </span>
            </div>
          </SelectItem>

          <SelectItem value="super_admin">
            <div className="flex flex-col items-start">
              <span>Super Admin</span>
              <span className="text-xs text-muted-foreground">
                Full access to all features
              </span>
            </div>
          </SelectItem>

          {/* System roles */}
          {roles.filter(r => r.is_system_role).length > 0 && (
            <>
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                System Roles
              </div>
              {roles
                .filter((role) => role.is_system_role)
                .map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    <div className="flex flex-col items-start">
                      <span>{role.name}</span>
                      {role.description && (
                        <span className="text-xs text-muted-foreground">
                          {role.description}
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
            </>
          )}

          {/* Custom roles */}
          {roles.filter(r => !r.is_system_role).length > 0 && (
            <>
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                Custom Roles
              </div>
              {roles
                .filter((role) => !role.is_system_role)
                .map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    <div className="flex flex-col items-start">
                      <span>{role.name}</span>
                      {role.description && (
                        <span className="text-xs text-muted-foreground">
                          {role.description}
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
            </>
          )}
        </SelectContent>
      </Select>
    </div>
  )
}
