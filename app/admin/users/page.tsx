/**
 * Users Management Page
 * Main page for viewing and managing users
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { UserTable } from '@/components/admin/users/UserTable'
import { UserCreateDialog } from '@/components/admin/users/UserCreateDialog'
import { ProtectedPage } from '@/components/admin/ProtectedPage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getUsers } from '@/actions/users'
import { Search, Filter, RefreshCw, UserPlus, Loader2 } from 'lucide-react'
import { usePermissions } from '@/lib/permissions'
import { useDebounce } from '@/hooks/useDebounce'

export default function UsersPage() {
  return (
    <ProtectedPage module="users" action="view">
      <UsersPageContent />
    </ProtectedPage>
  )
}

function UsersPageContent() {
  const { hasPermission } = usePermissions()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  // Pagination state
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  // Filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [roleTypeFilter, setRoleTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [departmentFilter, setDepartmentFilter] = useState<string>('')

  // Sort state
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Debounce search query
  const debouncedSearch = useDebounce(searchQuery, 500)

  // Check permissions for actions
  const canCreate = hasPermission('users', 'create')

  // Load users
  const loadUsers = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }

    const result = await getUsers({
      search: debouncedSearch || undefined,
      roleType: roleTypeFilter === 'all' ? undefined : roleTypeFilter || undefined,
      status: statusFilter === 'all' ? undefined : statusFilter || undefined,
      department: departmentFilter || undefined,
      sortBy,
      sortOrder,
      page,
      limit,
    })

    if (result.success) {
      setUsers(result.data.users)
      setTotalCount(result.data.totalCount)
      setTotalPages(result.data.totalPages)
    }

    setLoading(false)
    setRefreshing(false)
  }, [debouncedSearch, roleTypeFilter, statusFilter, departmentFilter, sortBy, sortOrder, page, limit])

  // Load users on mount and when filters change
  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, roleTypeFilter, statusFilter, departmentFilter])

  const handleRefresh = () => {
    loadUsers(true)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handleSortChange = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy)
    setSortOrder(newSortOrder)
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setRoleTypeFilter('all')
    setStatusFilter('all')
    setDepartmentFilter('')
    setPage(1)
  }

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

      {/* Filters */}
      <div className="bg-white border rounded-lg p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <h2 className="font-semibold">Filters</h2>
          {(searchQuery || roleTypeFilter !== 'all' || statusFilter !== 'all' || departmentFilter) && (
            <Button
              variant="link"
              size="sm"
              onClick={handleClearFilters}
              className="ml-auto"
            >
              Clear all
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Role Type Filter */}
          <Select value={roleTypeFilter} onValueChange={setRoleTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="super_admin">Super Admin</SelectItem>
              <SelectItem value="custom_role">Custom Role</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
            </SelectContent>
          </Select>

          {/* Department Filter */}
          <Input
            placeholder="Filter by department..."
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total Users</p>
          <p className="text-2xl font-bold mt-1">{totalCount}</p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Active Users</p>
          <p className="text-2xl font-bold mt-1 text-green-600">
            {users.filter((u) => u.status === 'active').length}
          </p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Pending Users</p>
          <p className="text-2xl font-bold mt-1 text-yellow-600">
            {users.filter((u) => u.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Blocked Users</p>
          <p className="text-2xl font-bold mt-1 text-red-600">
            {users.filter((u) => u.status === 'blocked').length}
          </p>
        </div>
      </div>

      {/* User Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12 bg-white border rounded-lg">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <UserTable
          users={users}
          totalCount={totalCount}
          page={page}
          limit={limit}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onSortChange={handleSortChange}
          onRefresh={handleRefresh}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />
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
