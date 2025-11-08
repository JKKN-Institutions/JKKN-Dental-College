/**
 * RoleCard Component
 * Card display for individual roles with actions
 */

'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Edit, Trash2, Copy, Shield, Users } from 'lucide-react'

interface RoleCardProps {
  role: {
    id: string
    name: string
    description: string | null
    is_system_role: boolean
    permissions: Record<string, any>
    created_at?: string
  }
  userCount?: number
  onEdit?: (roleId: string) => void
  onDelete?: (roleId: string) => void
  onClone?: (roleId: string) => void
  canEdit?: boolean
  canDelete?: boolean
}

export function RoleCard({
  role,
  userCount = 0,
  onEdit,
  onDelete,
  onClone,
  canEdit = true,
  canDelete = true,
}: RoleCardProps) {
  // Count total permissions
  const permissionCount = Object.values(role.permissions).reduce((acc, modulePerms) => {
    if (typeof modulePerms === 'object' && modulePerms !== null) {
      return acc + Object.values(modulePerms).filter((v) => v === true).length
    }
    return acc
  }, 0)

  const moduleCount = Object.keys(role.permissions).length

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{role.name}</CardTitle>
              {role.is_system_role && (
                <Badge variant="secondary" className="text-xs">
                  <Shield className="w-3 h-3 mr-1" />
                  System
                </Badge>
              )}
            </div>
            <CardDescription className="mt-1.5">
              {role.description || 'No description provided'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-primary-green">{permissionCount}</span>
            <span className="text-xs text-muted-foreground">Permissions</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-blue-600">{moduleCount}</span>
            <span className="text-xs text-muted-foreground">Modules</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-purple-600">{userCount}</span>
            <span className="text-xs text-muted-foreground">Users</span>
          </div>
        </div>

        {/* Module preview */}
        {moduleCount > 0 && (
          <div className="pt-2">
            <p className="text-xs text-muted-foreground mb-2">Access to:</p>
            <div className="flex flex-wrap gap-1">
              {Object.keys(role.permissions).slice(0, 3).map((module) => (
                <Badge key={module} variant="outline" className="text-xs">
                  {module.replace(/_/g, ' ')}
                </Badge>
              ))}
              {moduleCount > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{moduleCount - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2 border-t pt-4">
        {/* Edit Button */}
        {canEdit && onEdit && (
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onEdit(role.id)}
            disabled={role.is_system_role}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        )}

        {/* Clone Button */}
        {onClone && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onClone(role.id)}
          >
            <Copy className="w-4 h-4" />
          </Button>
        )}

        {/* Delete Button */}
        {canDelete && onDelete && !role.is_system_role && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(role.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
