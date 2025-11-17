import dynamic from 'next/dynamic';
import Navigation from "@/components/Navigation";
import LoadingScreen from "@/components/LoadingScreen";
import DynamicHomeSections from "@/components/DynamicHomeSections";
import FloatingNavButton from "@/components/FloatingNavButton";
import BottomNavigation from "@/components/BottomNavigation";

const Footer = dynamic(() => import("@/components/Footer"), { ssr: true });

export default function Home() {
  return (
    <>
      <LoadingScreen />
      <main className="min-h-screen">
        <Navigation />

        {/* Dynamically render all home sections from database */}
        {/* NewsTicker is now rendered after Hero section inside DynamicHomeSections */}
        <DynamicHomeSections />

        {/* Footer */}
        <Footer />
      </main>

      {/* Bottom Navigation - Mobile Only (Purple gradient design) */}
      <BottomNavigation />

      {/* Floating Navigation Button - Alternative option */}
      {/* <FloatingNavButton /> */}
    </>
  );
}
