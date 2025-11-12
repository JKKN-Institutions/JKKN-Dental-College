// =====================================================
// CREATE SECTION PAGE
// =====================================================

"use client";

import { SectionForm } from "../_components/section-form";

export default function CreateSectionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create New Section</h1>
        <p className="text-gray-600 mt-1">
          Add a new section to your home page
        </p>
      </div>

      <SectionForm mode="create" />
    </div>
  );
}
