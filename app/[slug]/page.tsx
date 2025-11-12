// =====================================================
// DYNAMIC PAGE ROUTE
// =====================================================
// Purpose: Catch-all route for dynamically created pages
// Layer: Pages (Route Handler)
// =====================================================

import { notFound } from "next/navigation";
import { PagesService } from "@/lib/services/pages/pages-service";
import { Metadata } from "next";

interface DynamicPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: DynamicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await PagesService.getPageBySlug(slug);

  if (!page) {
    return {
      title: "Page Not Found",
    };
  }

  return {
    title: page.meta_title || page.title,
    description: page.meta_description || page.excerpt,
    keywords: page.meta_keywords,
  };
}

export default async function DynamicPage({ params }: DynamicPageProps) {
  const { slug } = await params;
  // Fetch page by slug
  const page = await PagesService.getPageBySlug(slug);

  // Return 404 if page not found
  if (!page) {
    notFound();
  }

  // Get content HTML
  const contentHtml = (page.content as any)?.html || "";

  return (
    <div className="min-h-screen">
      {/* Page Container */}
      <div className={`${getTemplateClass(page.template_type)}`}>
        {/* Page Header */}
        <header className="bg-primary-green text-white py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{page.title}</h1>
            {page.excerpt && (
              <p className="text-xl text-gray-100 max-w-3xl">{page.excerpt}</p>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="py-12">
          <div className="container mx-auto px-4">
            <article
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

// Helper function to get template-specific classes
function getTemplateClass(templateType: string): string {
  switch (templateType) {
    case "full-width":
      return "w-full";
    case "sidebar":
      return "container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8";
    case "landing":
      return "w-full bg-gradient-to-b from-white to-gray-50";
    default:
      return "container mx-auto";
  }
}
