/**
 * Utility functions for data tables
 */

import { Table } from '@tanstack/react-table'

/**
 * Get selected row data from table
 */
export function getSelectedRowData<TData>(table: Table<TData>): TData[] {
  return table.getFilteredSelectedRowModel().rows.map((row) => row.original)
}

/**
 * Get all row data from table (respects filters)
 */
export function getAllRowData<TData>(table: Table<TData>): TData[] {
  return table.getFilteredRowModel().rows.map((row) => row.original)
}

/**
 * Format file size in bytes to human readable string
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

/**
 * Get column value from row data
 */
export function getColumnValue<TData>(row: TData, columnId: string): any {
  return (row as any)[columnId]
}

/**
 * Flatten nested object for export
 */
export function flattenObject(obj: any, prefix = ''): Record<string, any> {
  return Object.keys(obj).reduce((acc: Record<string, any>, key) => {
    const prefixedKey = prefix ? `${prefix}.${key}` : key

    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(acc, flattenObject(obj[key], prefixedKey))
    } else if (Array.isArray(obj[key])) {
      acc[prefixedKey] = obj[key].join(', ')
    } else {
      acc[prefixedKey] = obj[key]
    }

    return acc
  }, {})
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}
