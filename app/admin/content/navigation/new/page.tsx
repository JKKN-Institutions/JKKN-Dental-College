// =====================================================
// CREATE NAVIGATION ITEM PAGE
// =====================================================
// Purpose: Admin panel page for creating new navigation items
// Module: navigation
// Layer: Pages (Route Handler)
// =====================================================

"use client";

import { NavigationForm } from "@/components/admin/navigation/navigation-form";
import { Button } from "@/components/ui/button";
import { HiArrowLeft } from "react-icons/hi";
import { useRouter } from "next/navigation";

export default function NewNavigationPage() {
  const router = useRouter();

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
            Create Navigation Item
          </h1>
          <p className="text-gray-600 mt-1">
            Add a new item to the navigation menu
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <NavigationForm mode="create" />
      </div>
    </div>
  );
}
