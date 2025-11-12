// =====================================================
// SECTION ROW ACTIONS
// =====================================================

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HomeSection } from "@/types/sections";
import { useSectionMutations } from "@/hooks/sections/use-sections";
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
import { HiDotsVertical, HiPencil, HiTrash, HiEye, HiEyeOff } from "react-icons/hi";
import { toast } from "sonner";

interface RowActionsProps {
  section: HomeSection;
}

export function RowActions({ section }: RowActionsProps) {
  const router = useRouter();
  const { deleteSection, toggleVisibility } = useSectionMutations();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleEdit = () => {
    router.push(`/admin/content/sections/${section.id}/edit`);
  };

  const handleToggleVisibility = async () => {
    setIsToggling(true);
    try {
      const newStatus = !section.is_visible;
      await toggleVisibility(section.id, newStatus);
      toast.success(
        `Section ${newStatus ? "shown" : "hidden"} successfully`
      );
      router.refresh();
    } catch (error) {
      toast.error("Failed to update section visibility");
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const success = await deleteSection(section.id);
      if (success) {
        toast.success("Section deleted successfully");
        router.refresh();
        setShowDeleteDialog(false);
      } else {
        toast.error("Failed to delete section");
      }
    } catch (error) {
      toast.error("Failed to delete section");
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
          <DropdownMenuItem onClick={handleEdit}>
            <HiPencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleToggleVisibility} disabled={isToggling}>
            {section.is_visible ? (
              <>
                <HiEyeOff className="mr-2 h-4 w-4" />
                Hide
              </>
            ) : (
              <>
                <HiEye className="mr-2 h-4 w-4" />
                Show
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
              This will permanently delete the section "{section.title}".
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
