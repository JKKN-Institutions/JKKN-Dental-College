// =====================================================
// CREATE PAGE
// =====================================================

"use client";

import { PageForm } from "../_components/page-form";

export default function CreatePagePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create New Page</h1>
        <p className="text-gray-600 mt-1">
          Add a new page to your website
        </p>
      </div>

      <PageForm mode="create" />
    </div>
  );
}
