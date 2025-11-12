// =====================================================
// EDIT PAGE
// =====================================================

"use client";

import { usePage } from "@/hooks/pages/use-pages";
import { PageForm } from "../../_components/page-form";
import { HiRefresh } from "react-icons/hi";

interface EditPagePageProps {
  params: {
    id: string;
  };
}

export default function EditPagePage({ params }: EditPagePageProps) {
  const { page, loading, error } = usePage(params.id);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <HiRefresh className="h-8 w-8 animate-spin text-primary-green mx-auto mb-2" />
          <p className="text-gray-600">Loading page...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800 font-medium">Error loading page</p>
        <p className="text-red-600 text-sm mt-1">{error.message}</p>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800 font-medium">Page not found</p>
        <p className="text-yellow-600 text-sm mt-1">
          The page you are looking for does not exist.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Page</h1>
        <p className="text-gray-600 mt-1">
          Update page: {page.title}
        </p>
      </div>

      <PageForm page={page} mode="edit" />
    </div>
  );
}
