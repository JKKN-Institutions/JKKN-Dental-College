/**
 * UserTable Component
 * Data table for displaying users with sorting, filtering, and actions
 */

'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { UserStatusBadge } from './UserStatusBadge'
import { UserEditDialog } from './UserEditDialog'
import { Edit, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown } from 'lucide-react'
import { usePermissions } from '@/lib/permissions'
import Image from 'next/image'

interface User {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  phone: string | null
  role_type: string
  role_id: string | null
  role_name: string
  status: 'active' | 'blocked' | 'pending'
  department: string | null
  designation: string | null
  last_login_at: string | null
  created_at: string
}

interface UserTableProps {
  users: User[]
  totalCount: number
  page: number
  limit: number
  totalPages: number
  onPageChange: (page: number) => void
  onSortChange?: (sortBy: string, sortOrder: 'asc' | 'desc') => void
  onRefresh?: () => void
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export function UserTable({
  users,
  totalCount,
  page,
  limit,
  totalPages,
  onPageChange,
  onSortChange,
  onRefresh,
  sortBy = 'created_at',
  sortOrder = 'desc',
}: UserTableProps) {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const { hasPermission } = usePermissions()

  const canUpdate = hasPermission('users', 'update')

  const handleEdit = (userId: string) => {
    setSelectedUserId(userId)
    setEditDialogOpen(true)
  }

  const handleSort = (column: string) => {
    if (!onSortChange) return

    if (sortBy === column) {
      // Toggle sort order
      onSortChange(column, sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      // New column, default to ascending
      onSortChange(column, 'asc')
    }
  }

  const getRoleBadge = (roleType: string, roleName: string) => {
    if (roleType === 'super_admin') {
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded">
          Super Admin
        </span>
      )
    }

    if (roleType === 'custom_role') {
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">
          {roleName}
        </span>
      )
    }

    return (
      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
        User
      </span>
    )
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never'

    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date)
  }

  const SortIcon = ({ column }: { column: string }) => {
    if (sortBy !== column) {
      return <ArrowUpDown className="w-4 h-4 ml-1 opacity-50" />
    }
    return (
      <ArrowUpDown
        className={`w-4 h-4 ml-1 ${
          sortOrder === 'asc' ? 'rotate-180' : ''
        } transition-transform`}
      />
    )
  }

  return (
    <>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2"
                  onClick={() => handleSort('full_name')}
                >
                  Name
                  <SortIcon column="full_name" />
                </Button>
              </TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2"
                  onClick={() => handleSort('last_login_at')}
                >
                  Last Login
                  <SortIcon column="last_login_at" />
                </Button>
              </TableHead>
              {canUpdate && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={canUpdate ? 7 : 6} className="text-center py-12">
                  <p className="text-muted-foreground">No users found</p>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-green flex items-center justify-center overflow-hidden">
                        {user.avatar_url ? (
                          <Image
                            src={user.avatar_url}
                            alt={user.full_name || 'User'}
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-white text-sm font-medium">
                            {user.email[0].toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{user.full_name || '—'}</span>
                      {user.designation && (
                        <span className="text-xs text-muted-foreground">{user.designation}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role_type, user.role_name)}</TableCell>
                  <TableCell>
                    <span className="text-sm">{user.department || '—'}</span>
                  </TableCell>
                  <TableCell>
                    <UserStatusBadge status={user.status} />
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(user.last_login_at)}
                    </span>
                  </TableCell>
                  {canUpdate && (
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(user.id)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2 py-4">
        <div className="text-sm text-muted-foreground">
          Showing {users.length === 0 ? 0 : (page - 1) * limit + 1} to{' '}
          {Math.min(page * limit, totalCount)} of {totalCount} users
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(1)}
            disabled={page === 1}
          >
            <ChevronsLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="text-sm font-medium px-4">
            Page {page} of {totalPages || 1}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(totalPages)}
            disabled={page >= totalPages}
          >
            <ChevronsRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Edit Dialog */}
      <UserEditDialog
        userId={selectedUserId}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={onRefresh}
      />
    </>
  )
}
