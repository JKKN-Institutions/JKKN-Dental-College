/**
 * Users Management Page
 * Main page for viewing and managing users with advanced data table
 */

'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { UsersDataTable } from '@/components/admin/users/UsersDataTable'
import { UserCreateDialog } from '@/components/admin/users/UserCreateDialog'
import { ProtectedPage } from '@/components/admin/ProtectedPage'
import { Button } from '@/components/ui/button'
import { getUsers } from '@/actions/users'
import { RefreshCw, UserPlus, Users, UserCheck, UserCog, UserX } from 'lucide-react'
import { usePermissions } from '@/lib/permissions'
import { useQueryStates, parseAsInteger, parseAsString, parseAsArrayOf } from 'nuqs'
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton'
import type { User } from '@/components/admin/users/columns'

export default function UsersPage() {
  return (
    <ProtectedPage module="users" action="view">
      <Suspense fallback={<DataTableSkeleton columnCount={8} rowCount={10} />}>
        <UsersPageContent />
      </Suspense>
    </ProtectedPage>
  )
}

function UsersPageContent() {
  const { hasPermission } = usePermissions()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  // URL state management with nuqs
  const [{ page, per_page, sort, search, role_type, status }] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    per_page: parseAsInteger.withDefault(20),
    sort: parseAsString.withDefault('created_at.desc'),
    search: parseAsString.withDefault(''),
    role_type: parseAsArrayOf(parseAsString).withDefault([]),
    status: parseAsArrayOf(parseAsString).withDefault([]),
  })

  const canCreate = hasPermission('users', 'create')

  // Parse sort
  const [sortBy, sortOrder] = sort ? sort.split('.') : ['created_at', 'desc']

  // Load users
  const loadUsers = useCallback(
    async (showRefreshing = false) => {
      if (showRefreshing) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      const result = await getUsers({
        search: search || undefined,
        roleType: role_type.length > 0 ? role_type[0] : undefined,
        status: status.length > 0 ? status[0] : undefined,
        sortBy,
        sortOrder: sortOrder as 'asc' | 'desc',
        page,
        limit: per_page,
      })

      if (result.success) {
        setUsers(result.data.users)
        setTotalCount(result.data.totalCount)
        setTotalPages(result.data.totalPages)
      }

      setLoading(false)
      setRefreshing(false)
    },
    [search, role_type, status, sortBy, sortOrder, page, per_page]
  )

  // Load users when dependencies change
  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  const handleRefresh = () => {
    loadUsers(true)
  }

  // Calculate stats
  const activeCount = users.filter((u) => u.status === 'active').length
  const pendingCount = users.filter((u) => u.status === 'pending').length
  const blockedCount = users.filter((u) => u.status === 'blocked').length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground mt-1">
            Manage user accounts, roles, and permissions
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
              <UserPlus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Total Users</p>
          </div>
          <p className="text-2xl font-bold mt-2">{totalCount}</p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-green-600" />
            <p className="text-sm text-muted-foreground">Active Users</p>
          </div>
          <p className="text-2xl font-bold mt-2 text-green-600">{activeCount}</p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center gap-2">
            <UserCog className="w-5 h-5 text-yellow-600" />
            <p className="text-sm text-muted-foreground">Pending Users</p>
          </div>
          <p className="text-2xl font-bold mt-2 text-yellow-600">{pendingCount}</p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center gap-2">
            <UserX className="w-5 h-5 text-red-600" />
            <p className="text-sm text-muted-foreground">Blocked Users</p>
          </div>
          <p className="text-2xl font-bold mt-2 text-red-600">{blockedCount}</p>
        </div>
      </div>

      {/* Data Table */}
      {loading ? (
        <DataTableSkeleton
          columnCount={8}
          rowCount={10}
          searchableColumnCount={1}
          filterableColumnCount={2}
          showViewOptions={true}
        />
      ) : (
        <UsersDataTable data={users} pageCount={totalPages} />
      )}

      {/* Create User Dialog */}
      <UserCreateDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={handleRefresh}
      />
    </div>
  )
}
