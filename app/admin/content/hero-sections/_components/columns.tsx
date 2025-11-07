// =====================================================
// HERO SECTION TABLE COLUMNS
// =====================================================
// Purpose: TanStack Table column definitions
// Module: content/hero-sections
// Layer: Components (Data Table)
// =====================================================

'use client';

import { ColumnDef } from '@tanstack/react-table';
import { HeroSection } from '@/types/hero-section';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { RowActions } from './row-actions';

export const columns: ColumnDef<HeroSection>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => {
      const isActive = row.original.is_active;
      return (
        <div className="flex items-center gap-2">
          <div className="font-medium">{row.getValue('title')}</div>
          {isActive && (
            <Badge variant="default" className="bg-green-500">
              Active
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'tagline',
    header: 'Tagline',
    cell: ({ row }) => {
      const tagline = row.getValue('tagline') as string;
      return (
        <div className="max-w-md truncate text-muted-foreground">
          {tagline}
        </div>
      );
    },
  },
  {
    accessorKey: 'display_order',
    header: 'Order',
    cell: ({ row }) => {
      return (
        <div className="text-center">
          {row.getValue('display_order')}
        </div>
      );
    },
  },
  {
    accessorKey: 'is_active',
    header: 'Status',
    cell: ({ row }) => {
      const isActive = row.getValue('is_active') as boolean;
      return (
        <Badge variant={isActive ? 'default' : 'secondary'}>
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'updated_at',
    header: 'Last Updated',
    cell: ({ row }) => {
      const date = row.getValue('updated_at') as string;
      return (
        <div className="text-sm text-muted-foreground">
          {formatDistanceToNow(new Date(date), { addSuffix: true })}
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <RowActions row={row} />,
  },
];
