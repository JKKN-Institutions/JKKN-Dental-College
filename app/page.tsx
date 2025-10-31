import dynamic from 'next/dynamic';
import AnnouncementBanner from "@/components/AnnouncementBanner";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import AboutJKKN from "@/components/AboutJKKN";
import WhyChooseJKKN from "@/components/WhyChooseJKKN";

// Dynamically import below-the-fold components with SSR enabled for faster load
const OurInstitutions = dynamic(() => import("@/components/OurInstitutions"), { ssr: true });
const OurStrength = dynamic(() => import("@/components/OurStrength"), { ssr: true });
const CollegeNews = dynamic(() => import("@/components/CollegeNews"), { ssr: true });
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
    <main className="min-h-screen">
      <AnnouncementBanner />
      <Navigation />
      <HeroSection />
      <AboutJKKN />
      <OurInstitutions />
      <WhyChooseJKKN />
      <OurStrength />
      <CollegeNews />
      <LatestBuzz />
      <PastEvents />
      <CampusVideos />
      <SupportingPartners />
      <OurRecruiters />
      <OurAlumni />
      <LifeAtJKKN />
      <ContactUs />
      <Footer />
    </main>
  );
}
