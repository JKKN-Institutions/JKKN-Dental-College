// =====================================================
// SECTIONS TABLE COLUMNS
// =====================================================

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { HomeSection } from "@/types/sections";
import { Badge } from "@/components/ui/badge";
import { HiEye, HiEyeOff, HiArrowUp, HiArrowDown } from "react-icons/hi";
import { RowActions } from "./row-actions";

export const columns: ColumnDef<HomeSection>[] = [
  {
    accessorKey: "display_order",
    header: "Order",
    cell: ({ row }) => {
      const order = row.original.display_order;
      return (
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-900 text-lg">{order + 1}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Section",
    cell: ({ row }) => {
      const section = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{section.title}</span>
          <span className="text-sm text-gray-500">{section.section_key}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "section_type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.original.section_type;
      const typeColors: Record<string, string> = {
        hero: "bg-purple-100 text-purple-800",
        about: "bg-blue-100 text-blue-800",
        institutions: "bg-green-100 text-green-800",
        "why-choose": "bg-yellow-100 text-yellow-800",
        strength: "bg-red-100 text-red-800",
        news: "bg-indigo-100 text-indigo-800",
        buzz: "bg-pink-100 text-pink-800",
        events: "bg-orange-100 text-orange-800",
        videos: "bg-teal-100 text-teal-800",
        partners: "bg-cyan-100 text-cyan-800",
        recruiters: "bg-lime-100 text-lime-800",
        alumni: "bg-amber-100 text-amber-800",
        life: "bg-emerald-100 text-emerald-800",
        contact: "bg-slate-100 text-slate-800",
        custom: "bg-gray-100 text-gray-800",
      };

      return (
        <Badge
          variant="outline"
          className={`font-normal ${typeColors[type] || "bg-gray-100 text-gray-800"}`}
        >
          {type}
        </Badge>
      );
    },
  },
  {
    accessorKey: "component_name",
    header: "Component",
    cell: ({ row }) => {
      const component = row.original.component_name;
      return (
        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
          {component || "N/A"}
        </code>
      );
    },
  },
  {
    accessorKey: "is_visible",
    header: "Visibility",
    cell: ({ row }) => {
      const isVisible = row.original.is_visible;
      return (
        <Badge
          variant={isVisible ? "default" : "secondary"}
          className={
            isVisible
              ? "bg-green-100 text-green-800 hover:bg-green-100"
              : "bg-gray-100 text-gray-800 hover:bg-gray-100"
          }
        >
          {isVisible ? (
            <><HiEye className="mr-1 h-3 w-3" /> Visible</>
          ) : (
            <><HiEyeOff className="mr-1 h-3 w-3" /> Hidden</>
          )}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <RowActions section={row.original} />,
  },
];
