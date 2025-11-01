"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Hide loading screen after 2.5 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] bg-white flex items-center justify-center"
        >
          <div className="text-center">
            {/* Brand Keeradam Image */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
              }}
              className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 mx-auto mb-8"
            >
              <Image
                src="/images/loading image.jpeg"
                alt="JKKN Institution Logo"
                fill
                className="object-contain"
                priority
              />
            </motion.div>

            {/* Loading Animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="space-y-4"
            >
              {/* Institution Name */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-green">
                JKKN Institution
              </h1>

              {/* Tagline */}
              <p className="text-sm sm:text-base text-gray-600 px-4">
                Empowering Excellence, Inspiring Innovation
              </p>

              {/* Loading Spinner */}
              <div className="flex justify-center items-center gap-2 mt-6">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-3 h-3 bg-primary-green rounded-full"
                />
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.2,
                  }}
                  className="w-3 h-3 bg-primary-green rounded-full"
                />
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.4,
                  }}
                  className="w-3 h-3 bg-primary-green rounded-full"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
