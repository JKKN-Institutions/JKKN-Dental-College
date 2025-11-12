import dynamic from 'next/dynamic';
import Navigation from "@/components/Navigation";
import NewsTicker from "@/components/NewsTicker";
import LoadingScreen from "@/components/LoadingScreen";
import DynamicHomeSections from "@/components/DynamicHomeSections";

const Footer = dynamic(() => import("@/components/Footer"), { ssr: true });

export default function Home() {
  return (
    <>
      <LoadingScreen />
      <main className="min-h-screen">
        <Navigation />

        {/* Dynamically render all home sections from database */}
        <DynamicHomeSections />

        {/* News Ticker - can be controlled via sections too if needed */}
        <NewsTicker />

        {/* Footer */}
        <Footer />
      </main>
    </>
  );
}
