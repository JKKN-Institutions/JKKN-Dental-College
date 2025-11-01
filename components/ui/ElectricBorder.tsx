"use client";

import { motion } from "framer-motion";
import { ReactNode, useState } from "react";

interface ElectricBorderProps {
  children: ReactNode;
  variant?: "green" | "yellow" | "white" | "multi";
  borderWidth?: number;
  speed?: number;
}

export default function ElectricBorder({
  children,
  variant = "multi",
  borderWidth = 2,
  speed = 3
}: ElectricBorderProps) {
  const [isActive, setIsActive] = useState(false);

  const getGradient = () => {
    switch (variant) {
      case "green":
        return "linear-gradient(90deg, #187041, #22c55e, #187041, #22c55e)";
      case "yellow":
        return "linear-gradient(90deg, #eab308, #fbbf24, #eab308, #fbbf24)";
      case "white":
        return "linear-gradient(90deg, #ffffff, #e5e5e5, #ffffff, #e5e5e5)";
      case "multi":
        return "linear-gradient(90deg, #187041, #eab308, #ffffff, #187041, #eab308)";
      default:
        return "linear-gradient(90deg, #187041, #eab308, #ffffff, #187041, #eab308)";
    }
  };

  return (
    <div
      className="relative w-full h-full rounded-2xl p-[2px] overflow-hidden group"
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
      onTouchStart={() => setIsActive(true)}
      onTouchEnd={() => setTimeout(() => setIsActive(false), 2000)}
    >
      {/* Animated Border */}
      <motion.div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: getGradient(),
          backgroundSize: "300% 100%",
          opacity: isActive ? 1 : 0,
        }}
        animate={{
          backgroundPosition: ["0% 0%", "300% 0%"],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Content Container */}
      <div className="relative bg-white rounded-2xl h-full w-full">
        {children}
      </div>

      {/* Electric Glow Effect */}
      <motion.div
        className="absolute inset-0 blur-md transition-opacity duration-300 pointer-events-none"
        style={{
          background: getGradient(),
          backgroundSize: "300% 100%",
          opacity: isActive ? 0.3 : 0,
        }}
        animate={{
          backgroundPosition: ["0% 0%", "300% 0%"],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}
