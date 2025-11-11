"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Logo {
  id: number;
  name: string;
  logo: string;
}

interface LogoLoopProps {
  logos: Logo[];
  speed?: number;
  direction?: "left" | "right";
}

export default function LogoLoop({
  logos,
  speed = 30,
  direction = "left"
}: LogoLoopProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Use faster speed on mobile (half the duration)
  const animationSpeed = isMobile ? speed / 2 : speed;

  const handleTouchStart = () => {
    setIsPaused(true);
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
  };

  // Duplicate logos for seamless loop
  const duplicatedLogos = [...logos, ...logos, ...logos];

  return (
    <div className="relative w-full overflow-hidden py-8">
      {/* Gradient Overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10"></div>

      {/* Logo Loop Container */}
      <motion.div
        className="flex gap-12 items-center"
        animate={!isPaused ? {
          x: direction === "left" ? [0, -100 / 3 + "%"] : [-100 / 3 + "%", 0],
        } : {}}
        transition={!isPaused ? {
          duration: animationSpeed,
          repeat: Infinity,
          ease: "linear",
        } : {}}
        onHoverStart={() => setIsPaused(true)}
        onHoverEnd={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {duplicatedLogos.map((logo, index) => (
          <div
            key={`${logo.id}-${index}`}
            className="flex-shrink-0 w-40 h-24 flex items-center justify-center bg-white border-2 border-gray-100 rounded-xl p-4 hover:border-primary-green hover:shadow-xl transition-all duration-300 group"
          >
            <Image
              src={logo.logo}
              alt={logo.name}
              width={140}
              height={80}
              className="object-contain grayscale group-hover:grayscale-0 transition-all duration-300 max-w-full max-h-full"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
