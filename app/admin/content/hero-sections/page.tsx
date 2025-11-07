// =====================================================
// HERO SECTIONS LIST PAGE
// =====================================================
// Purpose: List view with filters and data table
// Module: content/hero-sections
// Layer: Pages (Routes)
// =====================================================

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useHeroSections } from '@/hooks/content/use-hero-sections';
import { HeroSectionFilters } from './_components/hero-section-filters';
import { HeroSectionDataTable } from './_components/hero-section-data-table';
import { columns } from './_components/columns';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HeroSectionsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Build filters
  const filters = {
    search: search || undefined,
    is_active:
      statusFilter === 'active'
        ? true
        : statusFilter === 'inactive'
        ? false
        : undefined,
  };

  const {
    heroSections,
    loading,
    error,
    total,
    page,
    setPage,
    pageSize,
    refetch,
  } = useHeroSections(filters);

  // Refetch when filters change
  useEffect(() => {
    refetch();
  }, [search, statusFilter, refetch]);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Hero Sections</h1>
          <p className="text-muted-foreground">
            Manage the hero section content for your website homepage
          </p>
        </div>
        <Button onClick={() => router.push('/admin/content/hero-sections/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Create Hero Section
        </Button>
      </div>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Sections</CardTitle>
          <CardDescription>
            View and manage all hero sections. Only one can be active at a time.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <HeroSectionFilters
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />

          {/* Error State */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
              <p className="font-medium">Error loading hero sections</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {/* Data Table */}
          {!loading && !error && (
            <HeroSectionDataTable
              columns={columns}
              data={heroSections}
              page={page}
              pageSize={pageSize}
              total={total}
              onPageChange={setPage}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
