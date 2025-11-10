"use client";

import { motion } from "framer-motion";
import { HiChevronDown } from "react-icons/hi";
import { useActiveHeroSection } from "@/hooks/content/use-hero-sections";
import Image from "next/image";

export default function HeroSection() {
  // Fetch active hero section from database
  const { heroSection, loading } = useActiveHeroSection();

  const scrollToNext = () => {
    const nextSection = document.querySelector("#about");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Use database content or fallback to default
  const title = heroSection?.title || "JKKN Institution";
  const tagline = heroSection?.tagline || "Empowering Excellence, Inspiring Innovation";
  const campusImageUrl = heroSection?.poster_image_url || "/images/college campus.jpg";
  const primaryCtaText = heroSection?.primary_cta_text || "Apply Now";
  const primaryCtaLink = heroSection?.primary_cta_link || "/admissions";
  const secondaryCtaText = heroSection?.secondary_cta_text || "Explore Campus";
  const secondaryCtaLink = heroSection?.secondary_cta_link || "/campus";

  return (
    <section id="hero" className="relative min-h-screen h-screen flex flex-col overflow-hidden landscape-compact">
      {/* Campus Image Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src={campusImageUrl}
          alt="JKKN Institution Campus"
          fill
          priority
          className="object-cover"
          sizes="100vw"
          quality={90}
        />
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
            {loading ? "Loading..." : title}
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
            {tagline}
          </motion.p>

          {/* CTA Buttons - Stack on mobile, side by side on tablet+ */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center items-center px-4"
          >
            <a
              href={primaryCtaLink}
              className="w-full xs:w-auto bg-primary-green hover:bg-primary-green/90 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-all duration-300 hover:scale-105 shadow-xl active:scale-95 min-w-[160px] sm:min-w-[180px] inline-block text-center"
              aria-label={`${primaryCtaText} - ${primaryCtaLink}`}
            >
              {primaryCtaText}
            </a>
            <a
              href={secondaryCtaLink}
              className="w-full xs:w-auto bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-all duration-300 hover:scale-105 border-2 border-white/30 active:scale-95 min-w-[160px] sm:min-w-[180px] inline-block text-center"
              aria-label={`${secondaryCtaText} - ${secondaryCtaLink}`}
            >
              {secondaryCtaText}
            </a>
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
