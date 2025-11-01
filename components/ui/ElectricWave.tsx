"use client";

import { motion } from "framer-motion";

interface ElectricWaveProps {
  variant?: "green" | "yellow" | "white";
  position?: "top" | "bottom" | "left" | "right";
  opacity?: number;
}

export default function ElectricWave({
  variant = "green",
  position = "bottom",
  opacity = 0.3
}: ElectricWaveProps) {

  const getColors = () => {
    switch (variant) {
      case "green":
        return {
          primary: "rgba(24, 112, 65, 0.6)", // primary-green
          secondary: "rgba(24, 112, 65, 0.3)",
          glow: "rgba(24, 112, 65, 0.8)"
        };
      case "yellow":
        return {
          primary: "rgba(234, 179, 8, 0.6)", // yellow
          secondary: "rgba(234, 179, 8, 0.3)",
          glow: "rgba(234, 179, 8, 0.8)"
        };
      case "white":
        return {
          primary: "rgba(255, 255, 255, 0.6)",
          secondary: "rgba(255, 255, 255, 0.3)",
          glow: "rgba(255, 255, 255, 0.8)"
        };
    }
  };

  const colors = getColors();

  const getPositionClasses = () => {
    switch (position) {
      case "top":
        return "top-0 left-0 right-0";
      case "bottom":
        return "bottom-0 left-0 right-0";
      case "left":
        return "left-0 top-0 bottom-0";
      case "right":
        return "right-0 top-0 bottom-0";
    }
  };

  const getWavePath = () => {
    if (position === "top" || position === "bottom") {
      return "M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,48C960,53,1056,75,1152,80C1248,85,1344,75,1392,69.3L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z";
    } else {
      return "M32,0L37.3,48C43,96,53,192,58.7,288C64,384,64,480,58.7,576C53,672,43,768,48,864C53,960,75,1056,80,1152C85,1248,75,1344,69.3,1392L64,1440L0,1440L0,1392C0,1344,0,1248,0,1152C0,1056,0,960,0,864C0,768,0,672,0,576C0,480,0,384,0,288C0,192,0,96,0,48L0,0Z";
    }
  };

  const isVertical = position === "left" || position === "right";

  return (
    <div
      className={`absolute ${getPositionClasses()} overflow-hidden pointer-events-none`}
      style={{ opacity }}
    >
      {/* Wave 1 - Main wave */}
      <svg
        className={`absolute ${isVertical ? 'h-full w-16' : 'w-full h-16'}`}
        viewBox={isVertical ? "0 0 64 1440" : "0 0 1440 64"}
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          d={getWavePath()}
          fill={colors.primary}
          animate={{
            d: [
              getWavePath(),
              position === "top" || position === "bottom"
                ? "M0,40L48,45.3C96,51,192,61,288,64C384,67,480,64,576,56C672,48,768,37,864,42.7C960,48,1056,72,1152,77.3C1248,83,1344,72,1392,66.7L1440,61L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
                : "M40,0L45.3,48C51,96,61,192,64,288C67,384,64,480,56,576C48,672,37,768,42.7,864C48,960,72,1056,77.3,1152C83,1248,72,1344,66.7,1392L61,1440L0,1440L0,1392C0,1344,0,1248,0,1152C0,1056,0,960,0,864C0,768,0,672,0,576C0,480,0,384,0,288C0,192,0,96,0,48L0,0Z",
              getWavePath(),
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </svg>

      {/* Wave 2 - Secondary wave */}
      <svg
        className={`absolute ${isVertical ? 'h-full w-16' : 'w-full h-16'}`}
        viewBox={isVertical ? "0 0 64 1440" : "0 0 1440 64"}
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          d={getWavePath()}
          fill={colors.secondary}
          animate={{
            d: [
              getWavePath(),
              position === "top" || position === "bottom"
                ? "M0,24L48,29.3C96,35,192,45,288,48C384,51,480,48,576,40C672,32,768,21,864,26.7C960,32,1056,56,1152,61.3C1248,67,1344,56,1392,50.7L1440,45L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
                : "M24,0L29.3,48C35,96,45,192,48,288C51,384,48,480,40,576C32,672,21,768,26.7,864C32,960,56,1056,61.3,1152C67,1248,56,1344,50.7,1392L45,1440L0,1440L0,1392C0,1344,0,1248,0,1152C0,1056,0,960,0,864C0,768,0,672,0,576C0,480,0,384,0,288C0,192,0,96,0,48L0,0Z",
              getWavePath(),
            ],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
      </svg>

      {/* Electric particles */}
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute ${isVertical ? 'w-1 h-1' : 'w-1 h-1'} rounded-full`}
            style={{ backgroundColor: colors.glow }}
            initial={
              isVertical
                ? { left: '50%', top: `${i * 20}%` }
                : { left: `${i * 20}%`, top: '50%' }
            }
            animate={
              isVertical
                ? {
                    top: [`${i * 20}%`, `${(i * 20 + 30) % 100}%`, `${i * 20}%`],
                    left: ['30%', '70%', '30%'],
                    scale: [0, 1, 0],
                  }
                : {
                    left: [`${i * 20}%`, `${(i * 20 + 30) % 100}%`, `${i * 20}%`],
                    top: ['30%', '70%', '30%'],
                    scale: [0, 1, 0],
                  }
            }
            transition={{
              duration: 2 + i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      {/* Glow effect */}
      <motion.div
        className={`absolute inset-0 blur-xl`}
        style={{
          background: `linear-gradient(${
            position === "top" || position === "bottom" ? "to bottom" : "to right"
          }, ${colors.glow}, transparent)`,
        }}
        animate={{
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
