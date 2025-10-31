'use client';

import { motion } from 'framer-motion';
import { ReactNode, useRef, useState } from 'react';

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  isInView?: boolean;
  spotlightColor?: string;
}

export default function SpotlightCard({
  children,
  className = '',
  delay = 0,
  isInView = true,
  spotlightColor = 'rgba(24, 112, 65, 0.15)' // primary-green with opacity
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePosition({ x, y });
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative bg-white rounded-2xl p-6 shadow-lg overflow-hidden
        hover:shadow-2xl transition-all duration-300 hover:-translate-y-2
        group cursor-pointer
        ${className}
      `}
    >
      {/* Spotlight Effect */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, ${spotlightColor}, transparent 40%)`
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}

      {/* Gradient Border Effect on Hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-[1px] bg-white rounded-2xl" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-green via-blue-500 to-primary-green opacity-20 blur-sm" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Animated Corner Accents */}
      <motion.div
        className="absolute top-0 right-0 w-20 h-20 bg-primary-green/5 rounded-bl-full"
        animate={{
          scale: isHovered ? 1.2 : 1,
          opacity: isHovered ? 0.3 : 0.1
        }}
        transition={{ duration: 0.3 }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-16 h-16 bg-primary-green/5 rounded-tr-full"
        animate={{
          scale: isHovered ? 1.2 : 1,
          opacity: isHovered ? 0.3 : 0.1
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}
