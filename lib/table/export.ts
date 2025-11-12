/**
 * Export utilities for data tables
 */

import { Table } from '@tanstack/react-table'
import * as Papa from 'papaparse'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { flattenObject, getAllRowData, getSelectedRowData } from './utils'

export interface ExportOptions {
  filename: string
  includeHeaders?: boolean
  onlySelected?: boolean
}

/**
 * Export table data to CSV
 */
export function exportToCSV<TData>(
  table: Table<TData>,
  options: ExportOptions
): void {
  const { filename, includeHeaders = true, onlySelected = false } = options

  // Get data to export
  const data = onlySelected
    ? getSelectedRowData(table)
    : getAllRowData(table)

  if (data.length === 0) {
    return
  }

  // Flatten nested objects
  const flattenedData = data.map((row) => flattenObject(row))

  // Convert to CSV
  const csv = Papa.unparse(flattenedData, {
    header: includeHeaders,
  })

  // Download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  saveAs(blob, `${filename}.csv`)
}

/**
 * Export table data to Excel
 */
export function exportToExcel<TData>(
  table: Table<TData>,
  options: ExportOptions
): void {
  const { filename, includeHeaders = true, onlySelected = false } = options

  // Get data to export
  const data = onlySelected
    ? getSelectedRowData(table)
    : getAllRowData(table)

  if (data.length === 0) {
    return
  }

  // Flatten nested objects
  const flattenedData = data.map((row) => flattenObject(row))

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(flattenedData, {
    header: includeHeaders ? undefined : [],
  })

  // Create workbook
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data')

  // Generate Excel file
  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  })

  // Download
  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  saveAs(blob, `${filename}.xlsx`)
}

/**
 * Export table data to JSON
 */
export function exportToJSON<TData>(
  table: Table<TData>,
  options: ExportOptions
): void {
  const { filename, onlySelected = false } = options

  // Get data to export
  const data = onlySelected
    ? getSelectedRowData(table)
    : getAllRowData(table)

  if (data.length === 0) {
    return
  }

  // Convert to JSON string
  const json = JSON.stringify(data, null, 2)

  // Download
  const blob = new Blob([json], { type: 'application/json' })
  saveAs(blob, `${filename}.json`)
}

/**
 * Export table data in specified format
 */
export function exportTableData<TData>(
  table: Table<TData>,
  format: 'csv' | 'xlsx' | 'json',
  options: ExportOptions
): void {
  switch (format) {
    case 'csv':
      exportToCSV(table, options)
      break
    case 'xlsx':
      exportToExcel(table, options)
      break
    case 'json':
      exportToJSON(table, options)
      break
    default:
      console.error(`Unsupported export format: ${format}`)
  }
}
