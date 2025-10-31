'use client';

import { motion } from 'framer-motion';
import { IconType } from 'react-icons';

interface IconCardProps {
  icon: IconType;
  title: string;
  description: string;
  delay?: number;
  isInView?: boolean;
}

export default function IconCard({
  icon: Icon,
  title,
  description,
  delay = 0,
  isInView = true
}: IconCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className='bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group'
    >
      <div className='w-16 h-16 bg-primary-green/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary-green group-hover:scale-110 transition-all duration-300'>
        <Icon className='text-4xl text-primary-green group-hover:text-white transition-colors duration-300' />
      </div>
      <h3 className='text-xl font-bold text-gray-900 mb-3'>{title}</h3>
      <p className='text-gray-600 leading-relaxed'>{description}</p>
    </motion.div>
  );
}
