/**
 * Column definitions for the users data table
 */

'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Edit, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { UserStatusBadge } from './UserStatusBadge'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'

export interface User {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  phone: string | null
  role_type: string
  role_id: string | null
  role_name: string
  status: 'active' | 'blocked' | 'pending'
  department_id: string | null
  department_name: string | null
  institution_id: string | null
  institution_name: string | null
  designation: string | null
  last_login_at: string | null
  created_at: string
  total_count?: number
}

export const getRoleBadge = (roleType: string, roleName: string) => {
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

export const getColumns = (
  onEdit: (userId: string) => void,
  canUpdate: boolean
): ColumnDef<User>[] => {
  const columns: ColumnDef<User>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="User" />
      ),
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-green flex items-center justify-center overflow-hidden flex-shrink-0">
              {user.avatar_url ? (
                <Image
                  src={user.avatar_url}
                  alt={user.full_name || 'User'}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-sm font-medium">
                  {user.email[0].toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-medium">{user.full_name || 'No Name'}</span>
              <span className="text-sm text-muted-foreground">{user.email}</span>
              {user.designation && (
                <span className="text-xs text-muted-foreground">
                  {user.designation}
                </span>
              )}
            </div>
          </div>
        )
      },
      enableHiding: false,
    },
    {
      accessorKey: 'role_type',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Role" />
      ),
      cell: ({ row }) => {
        const user = row.original
        return getRoleBadge(user.role_type, user.role_name)
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: 'institution_name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Institution" />
      ),
      cell: ({ row }) => {
        return <span className="text-sm">{row.getValue('institution_name') || '—'}</span>
      },
    },
    {
      accessorKey: 'department_name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Department" />
      ),
      cell: ({ row }) => {
        return <span className="text-sm">{row.getValue('department_name') || '—'}</span>
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        return <UserStatusBadge status={row.getValue('status')} />
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: 'last_login_at',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Last Login" />
      ),
      cell: ({ row }) => {
        const date = row.getValue('last_login_at') as string | null
        if (!date) return <span className="text-sm text-muted-foreground">Never</span>

        return (
          <span className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(date), { addSuffix: true })}
          </span>
        )
      },
    },
    {
      accessorKey: 'created_at',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created" />
      ),
      cell: ({ row }) => {
        const date = row.getValue('created_at') as string
        return (
          <span className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(date), { addSuffix: true })}
          </span>
        )
      },
    },
  ]

  // Add actions column if user has update permission
  if (canUpdate) {
    columns.push({
      id: 'actions',
      cell: ({ row }) => {
        const user = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(user.id)}
              >
                Copy user ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit(user.id)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit user
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    })
  }

  return columns
}
