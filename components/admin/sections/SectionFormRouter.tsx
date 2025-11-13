// =====================================================
// SECTION FORM ROUTER
// =====================================================
// Purpose: Routes to the correct specialized form based on section_type
// =====================================================

"use client";

import { HomeSection } from "@/types/sections";
import { NewsSectionForm } from "./forms/NewsSectionForm";
import { LatestBuzzSectionForm } from "./forms/LatestBuzzSectionForm";
import { SectionForm } from "@/app/admin/content/sections/_components/section-form";
import { useSectionMutations } from "@/hooks/sections/use-sections";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface SectionFormRouterProps {
  section: HomeSection;
}

export function SectionFormRouter({ section }: SectionFormRouterProps) {
  const router = useRouter();
  const { updateSection } = useSectionMutations();

  const handleSave = async (content: any) => {
    try {
      console.log("[SectionFormRouter] Saving section:", section.id);
      console.log("[SectionFormRouter] Content to save:", content);

      await updateSection({
        id: section.id,
        content: content,
      });

      console.log("[SectionFormRouter] Save successful, redirecting...");
      // Success toast is shown by the form component
      router.push("/admin/content/sections");
    } catch (error) {
      console.error("[SectionFormRouter] Error in handleSave:", error);
      // Error is logged by the hook, will be caught by form
      throw error;
    }
  };

  // Route to specialized form based on section_type
  switch (section.section_type) {
    case "news":
      return <NewsSectionForm section={section} onSave={handleSave} />;

    case "buzz":
      return <LatestBuzzSectionForm section={section} />;

    case "events":
      // TODO: return <EventsSectionForm section={section} onSave={handleSave} />;
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            Events Section Form - Coming Soon
          </h3>
          <p className="text-yellow-700 mb-4">
            The specialized form for Past Events section is under development.
            Use the generic form below for now.
          </p>
          <SectionForm section={section} mode="edit" />
        </div>
      );

    case "videos":
      // TODO: return <VideosSectionForm section={section} onSave={handleSave} />;
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            Videos Section Form - Coming Soon
          </h3>
          <p className="text-yellow-700 mb-4">
            The specialized form for Campus Videos section is under development.
            Use the generic form below for now.
          </p>
          <SectionForm section={section} mode="edit" />
        </div>
      );

    case "partners":
      // TODO: return <PartnersSectionForm section={section} onSave={handleSave} />;
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            Partners Section Form - Coming Soon
          </h3>
          <p className="text-yellow-700 mb-4">
            The specialized form for Supporting Partners section is under development.
            Use the generic form below for now.
          </p>
          <SectionForm section={section} mode="edit" />
        </div>
      );

    case "recruiters":
      // TODO: return <RecruitersSectionForm section={section} onSave={handleSave} />;
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            Recruiters Section Form - Coming Soon
          </h3>
          <p className="text-yellow-700 mb-4">
            The specialized form for Our Recruiters section is under development.
            Use the generic form below for now.
          </p>
          <SectionForm section={section} mode="edit" />
        </div>
      );

    case "alumni":
      // TODO: return <AlumniSectionForm section={section} onSave={handleSave} />;
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            Alumni Section Form - Coming Soon
          </h3>
          <p className="text-yellow-700 mb-4">
            The specialized form for Our Alumni section is under development.
            Use the generic form below for now.
          </p>
          <SectionForm section={section} mode="edit" />
        </div>
      );

    case "life":
      // TODO: return <LifeSectionForm section={section} onSave={handleSave} />;
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            Life@JKKN Section Form - Coming Soon
          </h3>
          <p className="text-yellow-700 mb-4">
            The specialized form for Life @ JKKN section is under development.
            Use the generic form below for now.
          </p>
          <SectionForm section={section} mode="edit" />
        </div>
      );

    // For sections that don't need specialized forms (hero, about, etc.)
    default:
      return <SectionForm section={section} mode="edit" />;
  }
}
