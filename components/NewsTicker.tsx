"use client";

import { motion } from "framer-motion";
import { HiSpeakerphone } from "react-icons/hi";
import { useState, useEffect } from "react";
import { useActiveHeroSection } from "@/hooks/content/use-hero-sections";

export default function NewsTicker() {
  const [isMobile, setIsMobile] = useState(false);

  // Fetch active hero section from database for news ticker text
  const { heroSection } = useActiveHeroSection();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Use database content or fallback to default
  const newsText = heroSection?.news_ticker_text || "Breaking News: Admissions Open for Academic Year 2025-2026 | Apply Now! | Limited Seats Available | Early Bird Discount Available";

  return (
    <div className="bg-primary-green text-white py-1.5 sm:py-2 overflow-hidden w-full">
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex-shrink-0 px-2 xs:px-3 sm:px-4 flex items-center gap-1 xs:gap-2 bg-primary-green/80">
          <HiSpeakerphone className="text-base xs:text-lg sm:text-xl" />
          <span className="font-bold text-xs xs:text-sm">NEWS</span>
        </div>
        <div className="flex-1 overflow-hidden">
          <motion.div
            className="flex whitespace-nowrap"
            animate={{
              x: [0, -1000],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: isMobile ? 10 : 20,
                ease: "linear",
              },
            }}
          >
            <span className="text-xs xs:text-sm md:text-base font-medium px-2 xs:px-4">{newsText}</span>
            <span className="text-xs xs:text-sm md:text-base font-medium px-2 xs:px-4">{newsText}</span>
            <span className="text-xs xs:text-sm md:text-base font-medium px-2 xs:px-4">{newsText}</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
