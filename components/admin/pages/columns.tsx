'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Eye, Edit, Copy, Archive, Trash } from 'lucide-react'
import Link from 'next/link'
import type { Page } from '@/types/page-builder'
import { formatDistanceToNow } from 'date-fns'

export const columns: ColumnDef<Page>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => {
      const page = row.original
      return (
        <div className="flex flex-col">
          <span className="font-medium">{page.title}</span>
          <span className="text-sm text-muted-foreground">/{page.slug}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status
      const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
        draft: 'outline',
        published: 'default',
        archived: 'secondary',
      }
      return <Badge variant={variants[status]}>{status}</Badge>
    },
  },
  {
    accessorKey: 'updated_at',
    header: 'Last Modified',
    cell: ({ row }) => {
      return formatDistanceToNow(new Date(row.original.updated_at), {
        addSuffix: true,
      })
    },
  },
  {
    accessorKey: 'creator',
    header: 'Author',
    cell: ({ row }) => {
      const creator = row.original.creator
      return creator?.full_name || creator?.email || 'Unknown'
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const page = row.original

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
            <DropdownMenuItem asChild>
              <Link href={`/${page.slug}`} target="_blank">
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/pages/${page.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                // TODO: Implement duplicate functionality
                navigator.clipboard.writeText(`/${page.slug}`)
              }}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy URL
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                // TODO: Implement archive functionality
              }}
            >
              <Archive className="mr-2 h-4 w-4" />
              Archive
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                // TODO: Implement delete functionality
              }}
              className="text-red-600"
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
