/**
 * Type definitions for advanced data tables
 */

import { Column } from '@tanstack/react-table'

export interface DataTableFilterOption<TData> {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
  count?: number
}

export interface DataTableFilterField<TData> {
  id: string
  label: string
  placeholder?: string
  options?: DataTableFilterOption<TData>[]
  type?: 'text' | 'select' | 'multi-select' | 'date-range' | 'slider'
  min?: number
  max?: number
  step?: number
  defaultValue?: string | string[] | [number, number] | [Date | undefined, Date | undefined]
}

export interface DataTableConfig {
  enableRowSelection?: boolean
  enableColumnVisibility?: boolean
  enablePagination?: boolean
  enableSorting?: boolean
  enableFiltering?: boolean
  enableExport?: boolean
  enableSearch?: boolean
}

export interface DataTableExportConfig {
  filename: string
  formats: ('csv' | 'xlsx' | 'json')[]
  includeHeaders?: boolean
  onlySelected?: boolean
}

export interface DataTableSearchConfig {
  placeholder?: string
  debounce?: number
}

export interface DataTableBulkAction<TData> {
  label: string
  icon?: React.ComponentType<{ className?: string }>
  onClick: (rows: TData[]) => void | Promise<void>
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  confirmMessage?: string
}

export type DataTableColumnHeader<TData, TValue> = {
  column: Column<TData, TValue>
  title: string
  className?: string
}
