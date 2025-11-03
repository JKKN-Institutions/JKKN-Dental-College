"use client";

import { motion } from "framer-motion";
import { HiChevronDown, HiSpeakerphone } from "react-icons/hi";
import { useEffect, useState } from "react";

export default function HeroSection() {
  const [showTicker, setShowTicker] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const handleScroll = () => {
      const heroSection = document.querySelector("#hero");
      if (heroSection) {
        const heroRect = heroSection.getBoundingClientRect();
        // Show ticker when Hero section is visible in viewport
        // On initial load, top will be positive, so we check if top < window height
        const isInHero = heroRect.top < window.innerHeight && heroRect.bottom > 0;
        setShowTicker(isInHero);
      }
    };

    checkMobile();
    handleScroll(); // Check initial position
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const scrollToNext = () => {
    const nextSection = document.querySelector("#about");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const newsText = "Breaking News: Admissions Open for Academic Year 2025-2026 | Apply Now! | Limited Seats Available | Early Bird Discount Available";

  return (
    <section id="hero" className="relative min-h-screen h-screen flex flex-col overflow-hidden landscape-compact">
      {/* News Ticker - Only shows in Hero Section */}
      {showTicker && (
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
      )}
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="w-full h-full object-cover"
          poster="/images/campus-poster.jpg"
        >
          <source src="/videos/campus-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Dark Overlay - Adaptive for better readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>
      </div>

      {/* Brand Logo - Shows at top of Hero (No Box) */}
      <div className="relative z-10 pt-32 sm:pt-36 md:pt-40 pb-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-2">
            JKKN Institution
          </h1>
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center text-center text-white px-4 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="space-y-4 sm:space-y-6 lg:space-y-8"
        >
          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-6 sm:mb-8 text-white font-bold max-w-xs xs:max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto px-4 leading-relaxed"
          >
            Empowering Excellence, Inspiring Innovation
          </motion.p>

          {/* CTA Buttons - Stack on mobile, side by side on tablet+ */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center items-center px-4"
          >
            <button
              className="w-full xs:w-auto bg-primary-green hover:bg-primary-green/90 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-all duration-300 hover:scale-105 shadow-xl active:scale-95 min-w-[160px] sm:min-w-[180px]"
              aria-label="Apply now for admission"
            >
              Apply Now
            </button>
            <button
              className="w-full xs:w-auto bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-all duration-300 hover:scale-105 border-2 border-white/30 active:scale-95 min-w-[160px] sm:min-w-[180px]"
              aria-label="Explore campus virtual tour"
            >
              Explore Campus
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator - Hidden on very small screens and landscape */}
      <motion.button
        onClick={scrollToNext}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          delay: 1.2,
          repeat: Infinity,
          repeatType: "reverse",
          repeatDelay: 0.5,
        }}
        className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-10 text-white hidden xs:flex"
        aria-label="Scroll down to next section"
      >
        <div className="flex flex-col items-center gap-1 sm:gap-2">
          <span className="text-xs sm:text-sm font-medium">Scroll Down</span>
          <HiChevronDown className="text-2xl sm:text-3xl animate-bounce" />
        </div>
      </motion.button>

      {/* Safe area spacing for notched devices */}
      <div className="absolute bottom-0 left-0 right-0 h-8 safe-bottom pointer-events-none"></div>
    </section>
  );
}
