// =====================================================
// EDIT SECTION PAGE
// =====================================================

"use client";

import { useSection } from "@/hooks/sections/use-sections";
import { SectionForm } from "../../_components/section-form";
import { HiRefresh } from "react-icons/hi";

interface EditSectionPageProps {
  params: {
    id: string;
  };
}

export default function EditSectionPage({ params }: EditSectionPageProps) {
  const { section, loading, error } = useSection(params.id);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <HiRefresh className="h-8 w-8 animate-spin text-primary-green mx-auto mb-2" />
          <p className="text-gray-600">Loading section...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800 font-medium">Error loading section</p>
        <p className="text-red-600 text-sm mt-1">{error.message}</p>
      </div>
    );
  }

  if (!section) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800 font-medium">Section not found</p>
        <p className="text-yellow-600 text-sm mt-1">
          The section you are looking for does not exist.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Section</h1>
        <p className="text-gray-600 mt-1">
          Update section: {section.title}
        </p>
      </div>

      <SectionForm section={section} mode="edit" />
    </div>
  );
}
