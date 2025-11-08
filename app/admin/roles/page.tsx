/**
 * Roles Management Page
 * Main page for viewing and managing custom roles
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { RoleCard } from '@/components/admin/roles/RoleCard'
import { RoleCreateDialog } from '@/components/admin/roles/RoleCreateDialog'
import { RoleEditDialog } from '@/components/admin/roles/RoleEditDialog'
import { RoleDeleteDialog } from '@/components/admin/roles/RoleDeleteDialog'
import { Button } from '@/components/ui/button'
import { getRoles, getRoleUserCount } from '@/actions/roles'
import { Shield, Plus, RefreshCw, Loader2 } from 'lucide-react'
import { usePermissions } from '@/lib/permissions'

export default function RolesPage() {
  const { hasPermission, loading: permissionsLoading } = usePermissions()
  const [roles, setRoles] = useState<any[]>([])
  const [userCounts, setUserCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null)

  // Permission checks
  const canView = hasPermission('roles', 'view')
  const canCreate = hasPermission('roles', 'create')
  const canUpdate = hasPermission('roles', 'update')
  const canDelete = hasPermission('roles', 'delete')

  // Load roles
  const loadRoles = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }

    const result = await getRoles()

    if (result.success) {
      setRoles(result.data)

      // Load user counts for each role
      const counts: Record<string, number> = {}
      await Promise.all(
        result.data.map(async (role) => {
          const countResult = await getRoleUserCount(role.id)
          if (countResult.success) {
            counts[role.id] = countResult.data
          }
        })
      )
      setUserCounts(counts)
    }

    setLoading(false)
    setRefreshing(false)
  }, [])

  useEffect(() => {
    if (!permissionsLoading && canView) {
      loadRoles()
    }
  }, [permissionsLoading, canView, loadRoles])

  const handleRefresh = () => {
    loadRoles(true)
  }

  const handleEdit = (roleId: string) => {
    setSelectedRoleId(roleId)
    setEditDialogOpen(true)
  }

  const handleDelete = (roleId: string) => {
    setSelectedRoleId(roleId)
    setDeleteDialogOpen(true)
  }

  const handleClone = (roleId: string) => {
    // TODO: Implement clone functionality in Phase 3
    console.log('Clone role:', roleId)
  }

  // Show loading state
  if (permissionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  // Show access denied
  if (!canView) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground">
          You don&apos;t have permission to view roles.
        </p>
      </div>
    )
  }

  // Separate system and custom roles
  const systemRoles = roles.filter((r) => r.is_system_role)
  const customRoles = roles.filter((r) => !r.is_system_role)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Role Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage custom roles and permissions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          {canCreate && (
            <Button size="sm" onClick={() => setCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Role
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total Roles</p>
          <p className="text-2xl font-bold mt-1">{roles.length}</p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">System Roles</p>
          <p className="text-2xl font-bold mt-1 text-blue-600">{systemRoles.length}</p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Custom Roles</p>
          <p className="text-2xl font-bold mt-1 text-green-600">{customRoles.length}</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* System Roles */}
          {systemRoles.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold">System Roles</h2>
                <span className="text-sm text-muted-foreground">
                  (Read-only, cannot be edited or deleted)
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {systemRoles.map((role) => (
                  <RoleCard
                    key={role.id}
                    role={role}
                    userCount={userCounts[role.id] || 0}
                    canEdit={false}
                    canDelete={false}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Custom Roles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                <h2 className="text-xl font-semibold">Custom Roles</h2>
              </div>
              {canCreate && customRoles.length === 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCreateDialogOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Role
                </Button>
              )}
            </div>

            {customRoles.length === 0 ? (
              <div className="border-2 border-dashed rounded-lg p-12 text-center">
                <Shield className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Custom Roles Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create custom roles with specific permissions to manage access control
                </p>
                {canCreate && (
                  <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Custom Role
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {customRoles.map((role) => (
                  <RoleCard
                    key={role.id}
                    role={role}
                    userCount={userCounts[role.id] || 0}
                    onEdit={canUpdate ? handleEdit : undefined}
                    onDelete={canDelete ? handleDelete : undefined}
                    onClone={canCreate ? handleClone : undefined}
                    canEdit={canUpdate}
                    canDelete={canDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Dialogs */}
      <RoleCreateDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={handleRefresh}
      />

      <RoleEditDialog
        roleId={selectedRoleId}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={handleRefresh}
      />

      <RoleDeleteDialog
        roleId={selectedRoleId}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={handleRefresh}
      />
    </div>
  )
}
