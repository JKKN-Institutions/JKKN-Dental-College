/**
 * Custom hooks for data tables
 */

'use client'

import * as React from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  RowSelectionState,
} from '@tanstack/react-table'
import { useQueryStates, parseAsInteger, parseAsString, parseAsArrayOf } from 'nuqs'

interface UseDataTableProps<TData, TValue> {
  data: TData[]
  columns: ColumnDef<TData, TValue>[]
  pageCount?: number
  defaultPerPage?: number
  defaultSort?: { id: string; desc: boolean }
  enableRowSelection?: boolean
  enableMultiRowSelection?: boolean
  getRowId?: (row: TData, index: number) => string
}

export function useDataTable<TData, TValue>({
  data,
  columns,
  pageCount = -1,
  defaultPerPage = 20,
  defaultSort,
  enableRowSelection = false,
  enableMultiRowSelection = true,
  getRowId,
}: UseDataTableProps<TData, TValue>) {
  // URL state management
  const [{ page, per_page, sort, filters }, setQuery] = useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      per_page: parseAsInteger.withDefault(defaultPerPage),
      sort: parseAsString.withDefault(
        defaultSort ? `${defaultSort.id}.${defaultSort.desc ? 'desc' : 'asc'}` : ''
      ),
      filters: parseAsArrayOf(parseAsString).withDefault([]),
    },
    {
      history: 'push',
    }
  )

  // Table state
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  // Parse sorting from URL
  const sorting: SortingState = React.useMemo(() => {
    if (!sort) return []
    const [id, order] = sort.split('.')
    return [{ id, desc: order === 'desc' }]
  }, [sort])

  // Update sorting in URL
  const setSorting = React.useCallback(
    (updaterOrValue: SortingState | ((old: SortingState) => SortingState)) => {
      const newSorting =
        typeof updaterOrValue === 'function'
          ? updaterOrValue(sorting)
          : updaterOrValue

      if (newSorting.length === 0) {
        setQuery({ sort: null })
      } else {
        const { id, desc } = newSorting[0]
        setQuery({ sort: `${id}.${desc ? 'desc' : 'asc'}` })
      }
    },
    [sorting, setQuery]
  )

  // Pagination
  const pagination: PaginationState = React.useMemo(
    () => ({
      pageIndex: page - 1,
      pageSize: per_page,
    }),
    [page, per_page]
  )

  const setPagination = React.useCallback(
    (updaterOrValue: PaginationState | ((old: PaginationState) => PaginationState)) => {
      const newPagination =
        typeof updaterOrValue === 'function'
          ? updaterOrValue(pagination)
          : updaterOrValue

      setQuery({
        page: newPagination.pageIndex + 1,
        per_page: newPagination.pageSize,
      })
    },
    [pagination, setQuery]
  )

  // Reset page when filters or sorting change
  React.useEffect(() => {
    if (page !== 1) {
      setQuery({ page: 1 })
    }
  }, [filters, sort])

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      sorting,
      pagination,
      rowSelection,
      columnVisibility,
      columnFilters,
    },
    enableRowSelection,
    enableMultiRowSelection,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: pageCount !== -1,
    manualSorting: pageCount !== -1,
    manualFiltering: pageCount !== -1,
    getRowId,
  })

  return table
}
