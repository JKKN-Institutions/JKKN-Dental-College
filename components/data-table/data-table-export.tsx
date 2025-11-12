/**
 * Export functionality component for data tables
 */

'use client'

import * as React from 'react'
import { Table } from '@tanstack/react-table'
import { Download, FileSpreadsheet, FileJson, FileText } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { exportTableData } from '@/lib/table/export'

interface DataTableExportProps<TData> {
  table: Table<TData>
  filename?: string
}

export function DataTableExport<TData>({
  table,
  filename = 'export',
}: DataTableExportProps<TData>) {
  const selectedRows = table.getFilteredSelectedRowModel().rows.length
  const hasSelection = selectedRows > 0

  const handleExport = (format: 'csv' | 'xlsx' | 'json', onlySelected: boolean = false) => {
    exportTableData(table, format, {
      filename: `${filename}-${new Date().toISOString().split('T')[0]}`,
      includeHeaders: true,
      onlySelected,
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        <DropdownMenuLabel>Export Format</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          <FileText className="mr-2 h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('xlsx')}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export as Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('json')}>
          <FileJson className="mr-2 h-4 w-4" />
          Export as JSON
        </DropdownMenuItem>
        {hasSelection && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>
              Export Selected ({selectedRows})
            </DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleExport('csv', true)}>
              <FileText className="mr-2 h-4 w-4" />
              Selected as CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('xlsx', true)}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Selected as Excel
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('json', true)}>
              <FileJson className="mr-2 h-4 w-4" />
              Selected as JSON
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
