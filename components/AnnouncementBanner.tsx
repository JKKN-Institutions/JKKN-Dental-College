"use client";

import { motion } from "framer-motion";
import { HiSpeakerphone } from "react-icons/hi";

export default function AnnouncementBanner() {
  const newsText = "Breaking News: Admissions Open for Academic Year 2025-2026 | Apply Now! | Limited Seats Available | Early Bird Discount Available";

  return (
    <div className="fixed top-0 left-0 right-0 bg-primary-green text-white py-1.5 sm:py-2 overflow-hidden z-[60] safe-top">
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
                duration: 20,
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
