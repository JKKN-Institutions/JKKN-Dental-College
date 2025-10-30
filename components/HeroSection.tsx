"use client";

import { motion } from "framer-motion";
import { HiChevronDown } from "react-icons/hi";

export default function HeroSection() {
  const scrollToNext = () => {
    const nextSection = document.querySelector("#why-choose");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          poster="/images/campus-poster.jpg"
        >
          <source src="/videos/campus-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
            JKKN Institution
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xl md:text-2xl lg:text-3xl mb-8 text-gray-200 max-w-3xl mx-auto"
          >
            Empowering Excellence, Inspiring Innovation
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button className="bg-primary-green hover:bg-primary-green/90 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-xl">
              Apply Now
            </button>
            <button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 border-2 border-white/30">
              Explore Campus
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
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
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 text-white"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm font-medium">Scroll Down</span>
          <HiChevronDown className="text-3xl animate-bounce" />
        </div>
      </motion.button>
    </section>
  );
}
