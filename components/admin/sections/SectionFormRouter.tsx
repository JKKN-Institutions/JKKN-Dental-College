// =====================================================
// SECTION FORM ROUTER
// =====================================================
// Purpose: Routes to the correct specialized form based on section_type
// =====================================================

"use client";

import { HomeSection } from "@/types/sections";
import { HeroSectionForm } from "./forms/HeroSectionForm";
import { NewsSectionForm } from "./forms/NewsSectionForm";
import { LatestBuzzSectionForm } from "./forms/LatestBuzzSectionForm";
import { PastEventsSectionForm } from "./forms/PastEventsSectionForm";
import { CampusVideosSectionForm } from "./forms/CampusVideosSectionForm";
import { PartnersSectionForm } from "./forms/PartnersSectionForm";
import { RecruitersSectionForm } from "./forms/RecruitersSectionForm";
import { AlumniSectionForm } from "./forms/AlumniSectionForm";
import { LifeAtJKKNSectionForm } from "./forms/LifeAtJKKNSectionForm";
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
    case "hero":
      return <HeroSectionForm section={section} />;

    case "news":
      return <NewsSectionForm section={section} onSave={handleSave} />;

    case "buzz":
      return <LatestBuzzSectionForm section={section} />;

    case "events":
      return <PastEventsSectionForm section={section} />;

    case "videos":
      return <CampusVideosSectionForm section={section} />;

    case "partners":
      return <PartnersSectionForm section={section} />;

    case "recruiters":
      return <RecruitersSectionForm section={section} />;

    case "alumni":
      return <AlumniSectionForm section={section} />;

    case "life":
      return <LifeAtJKKNSectionForm section={section} />;

    // For sections that don't need specialized forms (about, etc.)
    default:
      return <SectionForm section={section} mode="edit" />;
  }
}
