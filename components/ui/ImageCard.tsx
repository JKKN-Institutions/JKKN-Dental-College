'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface ImageCardProps {
  image: string;
  title: string;
  description?: string;
  date?: string;
  category?: string;
  delay?: number;
  isInView?: boolean;
  onClick?: () => void;
}

export default function ImageCard({
  image,
  title,
  description,
  date,
  category,
  delay = 0,
  isInView = true,
  onClick
}: ImageCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      onClick={onClick}
      className={`bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className='relative h-48 md:h-56 overflow-hidden'>
        <div className='w-full h-full bg-gray-200'>
          {/* Placeholder for image */}
          <div className='w-full h-full flex items-center justify-center text-gray-400 group-hover:scale-110 transition-transform duration-300'>
            <span className='text-sm'>Image: {image}</span>
          </div>
        </div>
        {category && (
          <div className='absolute top-4 left-4 bg-primary-green text-white px-3 py-1 rounded-full text-sm font-medium'>
            {category}
          </div>
        )}
      </div>
      <div className='p-6'>
        {date && (
          <p className='text-sm text-gray-500 mb-2'>{date}</p>
        )}
        <h3 className='text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-green transition-colors'>
          {title}
        </h3>
        {description && (
          <p className='text-gray-600 leading-relaxed line-clamp-3'>
            {description}
          </p>
        )}
      </div>
    </motion.div>
  );
}
