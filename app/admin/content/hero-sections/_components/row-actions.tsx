// =====================================================
// HERO SECTION ROW ACTIONS
// =====================================================
// Purpose: Action menu for hero section table rows
// Module: content/hero-sections
// Layer: Components (Actions)
// =====================================================

'use client';

import { Row } from '@tanstack/react-table';
import { HeroSection } from '@/types/hero-section';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, Copy, Eye, Power } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { HeroSectionService } from '@/lib/services/content/hero-section-service';
import { toast } from 'sonner';

interface RowActionsProps {
  row: Row<HeroSection>;
}

export function RowActions({ row }: RowActionsProps) {
  const router = useRouter();
  const heroSection = row.original;
  const [loading, setLoading] = useState(false);

  const handleEdit = () => {
    router.push(`/admin/content/hero-sections/${heroSection.id}/edit`);
  };

  const handleView = () => {
    router.push(`/admin/content/hero-sections/${heroSection.id}`);
  };

  const handleToggleActive = async () => {
    try {
      setLoading(true);
      await HeroSectionService.toggleActiveStatus(
        heroSection.id,
        !heroSection.is_active
      );

      toast.success(
        heroSection.is_active
          ? 'Hero section deactivated'
          : 'Hero section activated'
      );

      // Refresh the page to update the table
      router.refresh();
    } catch (error) {
      console.error('[row-actions] Toggle error:', error);
      toast.error('Failed to toggle hero section status');
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicate = async () => {
    try {
      setLoading(true);
      const duplicated = await HeroSectionService.duplicateHeroSection(
        heroSection.id
      );

      toast.success('Hero section duplicated successfully');

      // Navigate to edit the duplicated hero
      router.push(`/admin/content/hero-sections/${duplicated.id}/edit`);
    } catch (error) {
      console.error('[row-actions] Duplicate error:', error);
      toast.error('Failed to duplicate hero section');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this hero section? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      await HeroSectionService.deleteHeroSection(heroSection.id);

      toast.success('Hero section deleted successfully');

      // Refresh the page to update the table
      router.refresh();
    } catch (error) {
      console.error('[row-actions] Delete error:', error);
      toast.error('Failed to delete hero section');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0"
          disabled={loading}
        >
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>

        <DropdownMenuItem onClick={handleView}>
          <Eye className="mr-2 h-4 w-4" />
          View
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleToggleActive}>
          <Power className="mr-2 h-4 w-4" />
          {heroSection.is_active ? 'Deactivate' : 'Activate'}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleDuplicate}>
          <Copy className="mr-2 h-4 w-4" />
          Duplicate
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleDelete}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
