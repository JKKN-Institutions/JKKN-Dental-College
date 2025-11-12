// =====================================================
// HOME SECTIONS LIST PAGE
// =====================================================
// Purpose: Admin panel page for managing home page sections
// Module: sections
// Layer: Pages (Route Handler)
// =====================================================

"use client";

import { useSections } from "@/hooks/sections/use-sections";
import { Button } from "@/components/ui/button";
import { HiPlus, HiRefresh } from "react-icons/hi";
import { useRouter } from "next/navigation";
import { SectionFilters } from "@/types/sections";
import { SectionsDataTable } from "./_components/sections-data-table";
import { columns } from "./_components/columns";
import { SectionsFilters } from "./_components/sections-filters";

export default function SectionsListPage() {
  const router = useRouter();
  const {
    sections,
    loading,
    error,
    page,
    pageSize,
    total,
    updateFilters,
    goToPage,
    refetch,
  } = useSections();

  const handleFilterChange = (filters: SectionFilters) => {
    updateFilters(filters);
  };

  const handleCreateNew = () => {
    router.push("/admin/content/sections/new");
  };

  const pageCount = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Home Sections Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and reorder sections on your home page
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
            Add Section
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="text-sm text-gray-600">Total Sections</div>
          <div className="text-2xl font-bold text-gray-900">{total}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="text-sm text-gray-600">Visible</div>
          <div className="text-2xl font-bold text-green-600">
            {sections.filter(s => s.is_visible).length}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="text-sm text-gray-600">Hidden</div>
          <div className="text-2xl font-bold text-orange-600">
            {sections.filter(s => !s.is_visible).length}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="text-sm text-gray-600">Current Page</div>
          <div className="text-2xl font-bold text-gray-900">
            {page} / {pageCount || 1}
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 font-medium">💡 Pro Tip</p>
        <p className="text-blue-600 text-sm mt-1">
          Sections are displayed on your home page in the order shown below.
          Drag and drop to reorder (coming soon), or use the edit function to change display order.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Search & Filters
        </h2>
        <SectionsFilters onFilterChange={handleFilterChange} />
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">Error loading sections</p>
          <p className="text-red-600 text-sm mt-1">{error.message}</p>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-sm">
        {loading && sections.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <HiRefresh className="h-8 w-8 animate-spin text-primary-green mx-auto mb-2" />
              <p className="text-gray-600">Loading sections...</p>
            </div>
          </div>
        ) : (
          <SectionsDataTable
            columns={columns}
            data={sections}
            pageCount={pageCount}
            currentPage={page}
            onPageChange={goToPage}
          />
        )}
      </div>
    </div>
  );
}
