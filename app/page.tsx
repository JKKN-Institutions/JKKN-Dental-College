import dynamic from 'next/dynamic';
import AnnouncementBanner from "@/components/AnnouncementBanner";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import CollegeNews from "@/components/CollegeNews";
import LoadingScreen from "@/components/LoadingScreen";

// Dynamically import below-the-fold components with SSR enabled for faster load
const AboutJKKN = dynamic(() => import("@/components/AboutJKKN"), { ssr: true });
const OurInstitutions = dynamic(() => import("@/components/OurInstitutions"), { ssr: true });
const WhyChooseJKKN = dynamic(() => import("@/components/WhyChooseJKKN"), { ssr: true });
const OurStrength = dynamic(() => import("@/components/OurStrength"), { ssr: true });
const LatestBuzz = dynamic(() => import("@/components/LatestBuzz"), { ssr: true });
const PastEvents = dynamic(() => import("@/components/PastEvents"), { ssr: true });
const CampusVideos = dynamic(() => import("@/components/CampusVideos"), { ssr: true });
const SupportingPartners = dynamic(() => import("@/components/SupportingPartners"), { ssr: true });
const OurRecruiters = dynamic(() => import("@/components/OurRecruiters"), { ssr: true });
const OurAlumni = dynamic(() => import("@/components/OurAlumni"), { ssr: true });
const LifeAtJKKN = dynamic(() => import("@/components/LifeAtJKKN"), { ssr: true });
const ContactUs = dynamic(() => import("@/components/ContactUs"), { ssr: true });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: true });

export default function Home() {
  return (
    <>
      <LoadingScreen />
      <main className="min-h-screen">
        <Navigation />
        {/* 1. Hero Section */}
        <HeroSection />
      {/* 2. About Section */}
      <AboutJKKN />
      {/* 3. Our JKKN Institution */}
      <OurInstitutions />
      {/* 4. Why Choose JKKN */}
      <WhyChooseJKKN />
      {/* 5. Our Strength */}
      <OurStrength />
      {/* 6. College News */}
      <CollegeNews />
      {/* 7. Latest Buzz */}
      <LatestBuzz />
      {/* 8. Past Events */}
      <PastEvents />
      {/* 9. Campus Videos */}
      <CampusVideos />
      {/* 10. Supporting Partners */}
      <SupportingPartners />
      {/* 11. Our College Recruiters */}
      <OurRecruiters />
      {/* 12. Our College Alumni */}
      <OurAlumni />
      {/* 13. Life@JKKN */}
      <LifeAtJKKN />
        {/* 14. Get in Touch */}
        <ContactUs />
        <Footer />
      </main>
    </>
  );
}
