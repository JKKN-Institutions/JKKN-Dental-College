// =====================================================
// PAGE ROW ACTIONS
// =====================================================

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Page } from "@/types/pages";
import { usePageMutations } from "@/hooks/pages/use-pages";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { HiDotsVertical, HiEye, HiPencil, HiTrash, HiCheckCircle, HiXCircle } from "react-icons/hi";
import { toast } from "sonner";

interface RowActionsProps {
  page: Page;
}

export function RowActions({ page }: RowActionsProps) {
  const router = useRouter();
  const { deletePage, togglePublish } = usePageMutations();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleView = () => {
    window.open(`/${page.slug}`, "_blank");
  };

  const handleEdit = () => {
    router.push(`/admin/content/pages/${page.id}/edit`);
  };

  const handleTogglePublish = async () => {
    setIsToggling(true);
    try {
      const newStatus = !page.is_published;
      await togglePublish(page.id, newStatus);
      toast.success(
        `Page ${newStatus ? "published" : "unpublished"} successfully`
      );
      // Refresh the page to show updated data
      router.refresh();
    } catch (error) {
      toast.error("Failed to update page status");
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const success = await deletePage(page.id);
      if (success) {
        toast.success("Page deleted successfully");
        router.refresh();
        setShowDeleteDialog(false);
      } else {
        toast.error("Failed to delete page");
      }
    } catch (error) {
      toast.error("Failed to delete page");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <HiDotsVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {page.is_published && (
            <DropdownMenuItem onClick={handleView}>
              <HiEye className="mr-2 h-4 w-4" />
              View Page
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={handleEdit}>
            <HiPencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleTogglePublish} disabled={isToggling}>
            {page.is_published ? (
              <>
                <HiXCircle className="mr-2 h-4 w-4" />
                Unpublish
              </>
            ) : (
              <>
                <HiCheckCircle className="mr-2 h-4 w-4" />
                Publish
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-red-600"
          >
            <HiTrash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the page "{page.title}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
