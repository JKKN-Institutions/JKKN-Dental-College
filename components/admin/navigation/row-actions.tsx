// =====================================================
// NAVIGATION ROW ACTIONS
// =====================================================
// Purpose: Dropdown menu for edit/delete actions on navigation items
// Module: navigation
// Layer: Components
// =====================================================

"use client";

import { Row } from "@tanstack/react-table";
import { NavigationItem } from "@/types/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { HiDotsVertical, HiPencil, HiTrash, HiEye } from "react-icons/hi";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNavigationMutations } from "@/hooks/navigation/use-navigation";
import { toast } from "sonner";

interface RowActionsProps {
  row: Row<NavigationItem>;
}

export function RowActions({ row }: RowActionsProps) {
  const router = useRouter();
  const navigationItem = row.original;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { deleteNavigationItem, loading } = useNavigationMutations();

  const handleEdit = () => {
    router.push(`/admin/content/navigation/${navigationItem.id}/edit`);
  };

  const handleView = () => {
    // Open URL in new tab for preview
    window.open(navigationItem.url, "_blank");
  };

  const handleDelete = async () => {
    const success = await deleteNavigationItem(navigationItem.id);

    if (success) {
      toast.success("Navigation item deleted successfully");
      router.refresh(); // Refresh the page to update the list
    } else {
      toast.error("Failed to delete navigation item");
    }

    setShowDeleteDialog(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 hover:bg-gray-100"
            aria-label="Open actions menu"
          >
            <HiDotsVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={handleView} className="cursor-pointer">
            <HiEye className="mr-2 h-4 w-4" />
            Preview
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
            <HiPencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="cursor-pointer text-red-600 focus:text-red-600"
          >
            <HiTrash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the navigation item &quot;
              {navigationItem.label}&quot; and all its children (if any). This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
