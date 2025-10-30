import AnnouncementBanner from "@/components/AnnouncementBanner";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import WhyChooseJKKN from "@/components/WhyChooseJKKN";
import OurStrength from "@/components/OurStrength";
import CampusVideos from "@/components/CampusVideos";
import ContactUs from "@/components/ContactUs";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <AnnouncementBanner />
      <Navigation />
      <HeroSection />
      <WhyChooseJKKN />
      <OurStrength />
      <CampusVideos />
      <ContactUs />
      <Footer />
    </main>
  );
}
