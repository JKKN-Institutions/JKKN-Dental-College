// =====================================================
// DYNAMIC HOME SECTIONS
// =====================================================
// Purpose: Dynamically render home page sections from database
// Maintains existing component UI while making order/visibility dynamic
// =====================================================

"use client";

import { useVisibleSections } from "@/hooks/sections/use-sections";
import dynamic from 'next/dynamic';
import { HiRefresh } from "react-icons/hi";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Import all section components dynamically
const HeroSection = dynamic(() => import("@/components/HeroSection"), { ssr: true });
const AboutJKKN = dynamic(() => import("@/components/AboutJKKN"), { ssr: true });
const OurInstitutions = dynamic(() => import("@/components/OurInstitutions"), { ssr: true });
const WhyChooseJKKN = dynamic(() => import("@/components/WhyChooseJKKN"), { ssr: true });
const OurStrength = dynamic(() => import("@/components/OurStrength"), { ssr: true });
const CollegeNews = dynamic(() => import("@/components/CollegeNews"), { ssr: false });
const LatestBuzz = dynamic(() => import("@/components/LatestBuzz"), { ssr: true });
const PastEvents = dynamic(() => import("@/components/PastEvents"), { ssr: true });
const CampusVideos = dynamic(() => import("@/components/CampusVideos"), { ssr: true });
const SupportingPartners = dynamic(() => import("@/components/SupportingPartners"), { ssr: true });
const OurRecruiters = dynamic(() => import("@/components/OurRecruiters"), { ssr: true });
const OurAlumni = dynamic(() => import("@/components/OurAlumni"), { ssr: true });
const LifeAtJKKN = dynamic(() => import("@/components/LifeAtJKKN"), { ssr: true });
const ContactUs = dynamic(() => import("@/components/ContactUs"), { ssr: true });

// Map section component names to actual React components
const COMPONENT_MAP: Record<string, React.ComponentType<any>> = {
  'HeroSection': HeroSection,
  'AboutJKKN': AboutJKKN,
  'OurInstitutions': OurInstitutions,
  'WhyChooseJKKN': WhyChooseJKKN,
  'OurStrength': OurStrength,
  'CollegeNews': CollegeNews,
  'LatestBuzz': LatestBuzz,
  'PastEvents': PastEvents,
  'CampusVideos': CampusVideos,
  'SupportingPartners': SupportingPartners,
  'OurRecruiters': OurRecruiters,
  'OurAlumni': OurAlumni,
  'LifeAtJKKN': LifeAtJKKN,
  'ContactUs': ContactUs,
};

export default function DynamicHomeSections() {
  const { sections, loading, error, refetch } = useVisibleSections();
  const pathname = usePathname();

  // Force refetch when navigating to home page
  useEffect(() => {
    console.log('[DynamicHomeSections] Pathname changed:', pathname);
    if (pathname === '/') {
      console.log('[DynamicHomeSections] Home page detected, refetching sections...');
      refetch();
    }
  }, [pathname, refetch]);

  // Loading state with timeout fallback
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <HiRefresh className="h-12 w-12 animate-spin text-primary-green mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading sections...</p>
          <p className="text-gray-400 text-sm mt-2">If this takes too long, try refreshing the page</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    console.error('[DynamicHomeSections] Error:', error);
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-lg">
          <p className="text-red-800 font-medium text-lg mb-2">Error loading sections</p>
          <p className="text-red-600">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  // If no sections loaded, show message
  if (!loading && sections.length === 0) {
    console.warn('[DynamicHomeSections] No sections found');
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-lg">
          <p className="text-yellow-800 font-medium text-lg mb-2">No sections found</p>
          <p className="text-yellow-600">Please add sections in the admin panel</p>
        </div>
      </div>
    );
  }

  // Render sections in order
  return (
    <>
      {sections.map((section) => {
        const Component = section.component_name ? COMPONENT_MAP[section.component_name] : null;

        if (!Component) {
          console.warn(`[DynamicHomeSections] No component found for: ${section.component_name}`);
          return null;
        }

        // Render the component with section ID for scroll targeting
        return (
          <section key={section.id} id={section.section_key}>
            <Component />
          </section>
        );
      })}
    </>
  );
}
