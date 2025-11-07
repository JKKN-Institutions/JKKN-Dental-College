// =====================================================
// EDIT NAVIGATION ITEM PAGE
// =====================================================
// Purpose: Admin panel page for editing navigation items
// Module: navigation
// Layer: Pages (Route Handler)
// =====================================================

"use client";

import { useNavigationItem } from "@/hooks/navigation/use-navigation";
import { NavigationForm } from "@/components/admin/navigation/navigation-form";
import { Button } from "@/components/ui/button";
import { HiArrowLeft, HiRefresh } from "react-icons/hi";
import { useRouter, useParams } from "next/navigation";

export default function EditNavigationPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { navigationItem, loading, error } = useNavigationItem(id);

  const handleBack = () => {
    router.push("/admin/content/navigation");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={handleBack}
          className="gap-2"
        >
          <HiArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Edit Navigation Item
          </h1>
          <p className="text-gray-600 mt-1">
            Update navigation menu item details
          </p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-12">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <HiRefresh className="h-8 w-8 animate-spin text-primary-green mx-auto mb-2" />
              <p className="text-gray-600">Loading navigation item...</p>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800 font-medium">Error loading navigation item</p>
          <p className="text-red-600 text-sm mt-1">{error.message}</p>
          <Button
            variant="outline"
            onClick={handleBack}
            className="mt-4"
          >
            Back to List
          </Button>
        </div>
      )}

      {/* Not Found State */}
      {!loading && !error && !navigationItem && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-yellow-800 font-medium">Navigation item not found</p>
          <p className="text-yellow-600 text-sm mt-1">
            The navigation item you are looking for does not exist or has been deleted.
          </p>
          <Button
            variant="outline"
            onClick={handleBack}
            className="mt-4"
          >
            Back to List
          </Button>
        </div>
      )}

      {/* Form */}
      {!loading && !error && navigationItem && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <NavigationForm
            navigationItem={navigationItem}
            mode="edit"
          />
        </div>
      )}
    </div>
  );
}
