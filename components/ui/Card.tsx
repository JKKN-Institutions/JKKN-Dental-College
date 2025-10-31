'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
  isInView?: boolean;
}

export default function Card({
  children,
  className = '',
  hover = true,
  delay = 0,
  isInView = true
}: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className={`
        bg-white rounded-2xl p-6 shadow-lg
        ${hover ? 'hover:shadow-2xl hover:-translate-y-2 transition-all duration-300' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
