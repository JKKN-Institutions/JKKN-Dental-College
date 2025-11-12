// =====================================================
// PAGES TABLE COLUMNS
// =====================================================

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Page } from "@/types/pages";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HiCheck, HiX, HiEye, HiPencil, HiTrash } from "react-icons/hi";
import { RowActions } from "./row-actions";
import { format } from "date-fns";

export const columns: ColumnDef<Page>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const page = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{page.title}</span>
          <span className="text-sm text-gray-500">/{page.slug}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "template_type",
    header: "Template",
    cell: ({ row }) => {
      const templateType = row.original.template_type;
      const templateLabels: Record<string, string> = {
        default: "Default",
        "full-width": "Full Width",
        sidebar: "Sidebar",
        landing: "Landing",
      };
      return (
        <Badge variant="outline" className="font-normal">
          {templateLabels[templateType] || templateType}
        </Badge>
      );
    },
  },
  {
    accessorKey: "is_published",
    header: "Status",
    cell: ({ row }) => {
      const isPublished = row.original.is_published;
      return (
        <Badge
          variant={isPublished ? "default" : "secondary"}
          className={
            isPublished
              ? "bg-green-100 text-green-800 hover:bg-green-100"
              : "bg-orange-100 text-orange-800 hover:bg-orange-100"
          }
        >
          {isPublished ? (
            <><HiCheck className="mr-1 h-3 w-3" /> Published</>
          ) : (
            <><HiX className="mr-1 h-3 w-3" /> Draft</>
          )}
        </Badge>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => {
      const date = row.original.created_at;
      return (
        <span className="text-sm text-gray-600">
          {format(new Date(date), "MMM dd, yyyy")}
        </span>
      );
    },
  },
  {
    accessorKey: "updated_at",
    header: "Updated",
    cell: ({ row }) => {
      const date = row.original.updated_at;
      return (
        <span className="text-sm text-gray-600">
          {format(new Date(date), "MMM dd, yyyy")}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <RowActions page={row.original} />,
  },
];
