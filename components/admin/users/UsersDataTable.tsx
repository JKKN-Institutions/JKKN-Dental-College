/**
 * Advanced Users Data Table Component
 * Uses TanStack Table with advanced filtering, sorting, and export
 */

'use client'

import * as React from 'react'
import { useState } from 'react'
import { useDataTable } from '@/lib/table/hooks'
import { DataTable } from '@/components/data-table/data-table'
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar'
import { DataTablePagination } from '@/components/data-table/data-table-pagination'
import { DataTableExport } from '@/components/data-table/data-table-export'
import { getColumns, User } from './columns'
import { usePermissions } from '@/lib/permissions'
import { UserEditDialog } from './UserEditDialog'
import { Shield, UserX, UserCheck, UserCog } from 'lucide-react'

interface UsersDataTableProps {
  data: User[]
  pageCount: number
}

export function UsersDataTable({ data, pageCount }: UsersDataTableProps) {
  const { hasPermission } = usePermissions()
  const canUpdate = hasPermission('users', 'update')

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const handleEdit = (userId: string) => {
    setSelectedUserId(userId)
    setEditDialogOpen(true)
  }

  const columns = React.useMemo(
    () => getColumns(handleEdit, canUpdate),
    [canUpdate]
  )

  const table = useDataTable({
    data,
    columns,
    pageCount,
    defaultPerPage: 20,
    defaultSort: { id: 'created_at', desc: true },
    enableRowSelection: true,
    enableMultiRowSelection: true,
    getRowId: (row) => row.id,
  })

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        searchColumn="email"
        searchPlaceholder="Search by email..."
        filters={[
          {
            columnId: 'role_type',
            title: 'Role',
            options: [
              {
                label: 'Super Admin',
                value: 'super_admin',
                icon: Shield,
              },
              {
                label: 'Custom Role',
                value: 'custom_role',
                icon: UserCog,
              },
              {
                label: 'User',
                value: 'user',
                icon: UserCheck,
              },
            ],
          },
          {
            columnId: 'status',
            title: 'Status',
            options: [
              {
                label: 'Active',
                value: 'active',
                icon: UserCheck,
              },
              {
                label: 'Pending',
                value: 'pending',
                icon: UserCog,
              },
              {
                label: 'Blocked',
                value: 'blocked',
                icon: UserX,
              },
            ],
          },
        ]}
      >
        <DataTableExport table={table} filename="users" />
      </DataTableToolbar>

      <DataTable
        table={table}
        columns={columns}
        emptyMessage="No users found. Try adjusting your filters."
      />

      <DataTablePagination table={table} />

      {/* Edit Dialog */}
      <UserEditDialog
        userId={selectedUserId}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={() => {
          // Refresh will be handled by the parent component
          window.location.reload()
        }}
      />
    </div>
  )
}
