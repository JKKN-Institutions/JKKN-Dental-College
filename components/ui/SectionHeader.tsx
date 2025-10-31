'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  highlight?: string;
  centered?: boolean;
  className?: string;
}

export default function SectionHeader({
  title,
  subtitle,
  highlight,
  centered = true,
  className = ''
}: SectionHeaderProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className={`mb-12 md:mb-16 ${centered ? 'text-center' : ''} ${className}`}
    >
      <h2 className='text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4'>
        {title}{' '}
        {highlight && <span className='text-primary-green'>{highlight}</span>}
      </h2>
      {subtitle && (
        <p className='text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto'>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
