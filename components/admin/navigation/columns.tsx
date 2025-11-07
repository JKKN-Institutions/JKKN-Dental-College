// =====================================================
// NAVIGATION TABLE COLUMNS
// =====================================================
// Purpose: TanStack Table column definitions for navigation items
// Module: navigation
// Layer: Components
// =====================================================

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { NavigationItem } from "@/types/navigation";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RowActions } from "./row-actions";
import { HiArrowsUpDown } from "react-icons/hi2";
import { Button } from "@/components/ui/button";

export const columns: ColumnDef<NavigationItem>[] = [
  // Selection Column
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
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

  // Label Column (with hierarchy indicator)
  {
    accessorKey: "label",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-gray-100"
        >
          Label
          <HiArrowsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const depth = row.original.depth;
      const label = row.original.label;
      const indent = depth > 0 ? "→ ".repeat(depth) : "";

      return (
        <div className="flex items-center gap-2">
          <span className="font-medium">
            {indent}{label}
          </span>
        </div>
      );
    },
  },

  // URL Column
  {
    accessorKey: "url",
    header: "URL",
    cell: ({ row }) => {
      const url = row.original.url;
      return (
        <code className="px-2 py-1 bg-gray-100 rounded text-sm">
          {url}
        </code>
      );
    },
  },

  // Target Column
  {
    accessorKey: "target",
    header: "Target",
    cell: ({ row }) => {
      const target = row.original.target;
      return (
        <Badge variant={target === "_blank" ? "default" : "secondary"}>
          {target === "_blank" ? "New Tab" : "Same Tab"}
        </Badge>
      );
    },
  },

  // Display Order Column
  {
    accessorKey: "display_order",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-gray-100"
        >
          Order
          <HiArrowsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="text-center">{row.original.display_order}</div>;
    },
  },

  // Depth Column
  {
    accessorKey: "depth",
    header: "Level",
    cell: ({ row }) => {
      const depth = row.original.depth;
      const levelText = depth === 0 ? "Top" : `Sub ${depth}`;
      return (
        <Badge variant="outline" className="font-mono">
          {levelText}
        </Badge>
      );
    },
  },

  // Active Status Column
  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.original.is_active;
      return (
        <Badge
          variant={isActive ? "default" : "destructive"}
          className={isActive ? "bg-green-600" : ""}
        >
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },

  // Featured Column
  {
    accessorKey: "is_featured",
    header: "Featured",
    cell: ({ row }) => {
      const isFeatured = row.original.is_featured;
      return isFeatured ? (
        <Badge variant="default" className="bg-yellow-600">
          ⭐ Featured
        </Badge>
      ) : (
        <span className="text-gray-400">-</span>
      );
    },
  },

  // Auth Required Column
  {
    accessorKey: "requires_auth",
    header: "Auth",
    cell: ({ row }) => {
      const requiresAuth = row.original.requires_auth;
      return requiresAuth ? (
        <Badge variant="outline">🔒 Auth</Badge>
      ) : (
        <Badge variant="secondary">Public</Badge>
      );
    },
  },

  // Created At Column
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-gray-100"
        >
          Created
          <HiArrowsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.original.created_at);
      return (
        <div className="text-sm text-gray-600">
          {date.toLocaleDateString()}
        </div>
      );
    },
  },

  // Actions Column
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <RowActions row={row} />,
    enableSorting: false,
    enableHiding: false,
  },
];
