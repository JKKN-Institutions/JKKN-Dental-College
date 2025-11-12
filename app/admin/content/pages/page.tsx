// =====================================================
// PAGES LIST PAGE
// =====================================================
// Purpose: Admin panel page for managing dynamic pages
// Module: pages
// Layer: Pages (Route Handler)
// =====================================================

"use client";

import { usePages } from "@/hooks/pages/use-pages";
import { Button } from "@/components/ui/button";
import { HiPlus, HiRefresh } from "react-icons/hi";
import { useRouter } from "next/navigation";
import { PageFilters } from "@/types/pages";
import { PagesDataTable } from "./_components/pages-data-table";
import { columns } from "./_components/columns";
import { PagesFilters } from "./_components/pages-filters";

export default function PagesListPage() {
  const router = useRouter();
  const {
    pages,
    loading,
    error,
    page,
    pageSize,
    total,
    updateFilters,
    goToPage,
    refetch,
  } = usePages();

  const handleFilterChange = (filters: PageFilters) => {
    updateFilters(filters);
  };

  const handleCreateNew = () => {
    router.push("/admin/content/pages/new");
  };

  const pageCount = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Pages Management
          </h1>
          <p className="text-gray-600 mt-1">
            Create and manage dynamic pages for your website
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={refetch}
            disabled={loading}
            className="gap-2"
          >
            <HiRefresh className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            onClick={handleCreateNew}
            className="bg-primary-green hover:bg-primary-green/90 gap-2"
          >
            <HiPlus className="h-5 w-5" />
            Create Page
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="text-sm text-gray-600">Total Pages</div>
          <div className="text-2xl font-bold text-gray-900">{total}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="text-sm text-gray-600">Published</div>
          <div className="text-2xl font-bold text-green-600">
            {pages.filter(p => p.is_published).length}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="text-sm text-gray-600">Drafts</div>
          <div className="text-2xl font-bold text-orange-600">
            {pages.filter(p => !p.is_published).length}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="text-sm text-gray-600">Current Page</div>
          <div className="text-2xl font-bold text-gray-900">
            {page} / {pageCount || 1}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Search & Filters
        </h2>
        <PagesFilters onFilterChange={handleFilterChange} />
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">Error loading pages</p>
          <p className="text-red-600 text-sm mt-1">{error.message}</p>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-sm">
        {loading && pages.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <HiRefresh className="h-8 w-8 animate-spin text-primary-green mx-auto mb-2" />
              <p className="text-gray-600">Loading pages...</p>
            </div>
          </div>
        ) : (
          <PagesDataTable
            columns={columns}
            data={pages}
            pageCount={pageCount}
            currentPage={page}
            onPageChange={goToPage}
          />
        )}
      </div>
    </div>
  );
}
