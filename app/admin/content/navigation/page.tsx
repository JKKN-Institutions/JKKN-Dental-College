// =====================================================
// NAVIGATION LIST PAGE
// =====================================================
// Purpose: Admin panel page for managing navigation items
// Module: navigation
// Layer: Pages (Route Handler)
// =====================================================

"use client";

import { useNavigationItems } from "@/hooks/navigation/use-navigation";
import { columns } from "@/components/admin/navigation/columns";
import { NavigationDataTable } from "@/components/admin/navigation/navigation-data-table";
import { NavigationFilters } from "@/components/admin/navigation/navigation-filters";
import { Button } from "@/components/ui/button";
import { HiPlus, HiRefresh } from "react-icons/hi";
import { useRouter } from "next/navigation";
import { NavigationItemFilters } from "@/types/navigation";

export default function NavigationPage() {
  const router = useRouter();
  const {
    navigationItems,
    loading,
    error,
    page,
    pageSize,
    total,
    updateFilters,
    goToPage,
    refetch,
  } = useNavigationItems();

  const handleFilterChange = (filters: NavigationItemFilters) => {
    updateFilters(filters);
  };

  const handleCreateNew = () => {
    router.push("/admin/content/navigation/new");
  };

  const pageCount = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Navigation Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage website navigation menu items and hierarchy
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
            Add Navigation Item
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="text-sm text-gray-600">Total Items</div>
          <div className="text-2xl font-bold text-gray-900">{total}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="text-sm text-gray-600">Current Page</div>
          <div className="text-2xl font-bold text-gray-900">
            {page} / {pageCount || 1}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="text-sm text-gray-600">Items on Page</div>
          <div className="text-2xl font-bold text-gray-900">
            {navigationItems.length}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Search & Filters
        </h2>
        <NavigationFilters onFilterChange={handleFilterChange} />
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">Error loading navigation items</p>
          <p className="text-red-600 text-sm mt-1">{error.message}</p>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-sm">
        {loading && navigationItems.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <HiRefresh className="h-8 w-8 animate-spin text-primary-green mx-auto mb-2" />
              <p className="text-gray-600">Loading navigation items...</p>
            </div>
          </div>
        ) : (
          <NavigationDataTable
            columns={columns}
            data={navigationItems}
            pageCount={pageCount}
            currentPage={page}
            onPageChange={goToPage}
          />
        )}
      </div>
    </div>
  );
}
