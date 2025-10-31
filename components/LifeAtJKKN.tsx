'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  HiUserGroup,
  HiAcademicCap,
  HiHeart,
  HiGlobe,
  HiMusicNote,
  HiBeaker
} from 'react-icons/hi';
import { HiBolt, HiTrophy } from 'react-icons/hi2';
import SectionHeader from './ui/SectionHeader';

const lifeCategories = [
  {
    icon: HiAcademicCap,
    title: 'Academic Excellence',
    description: 'World-class curriculum with hands-on learning',
    color: 'from-blue-500 to-blue-600'
  },
  {
    icon: HiUserGroup,
    title: 'Student Communities',
    description: '50+ clubs and technical societies',
    color: 'from-purple-500 to-purple-600'
  },
  {
    icon: HiTrophy,
    title: 'Sports & Fitness',
    description: 'State-of-the-art sports facilities',
    color: 'from-green-500 to-green-600'
  },
  {
    icon: HiMusicNote,
    title: 'Cultural Activities',
    description: 'Music, dance, drama, and more',
    color: 'from-pink-500 to-pink-600'
  },
  {
    icon: HiBeaker,
    title: 'Research & Innovation',
    description: 'Cutting-edge labs and research centers',
    color: 'from-orange-500 to-orange-600'
  },
  {
    icon: HiGlobe,
    title: 'Global Exposure',
    description: 'International collaborations and exchanges',
    color: 'from-teal-500 to-teal-600'
  },
  {
    icon: HiBolt,
    title: 'Entrepreneurship',
    description: 'Innovation labs and startup support',
    color: 'from-yellow-500 to-yellow-600'
  },
  {
    icon: HiHeart,
    title: 'Student Wellness',
    description: 'Health, counseling, and support services',
    color: 'from-red-500 to-red-600'
  }
];

export default function LifeAtJKKN() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id='life-at-jkkn'
      ref={ref}
      className='py-20 bg-white relative overflow-hidden'
    >
      {/* Decorative Elements */}
      <div className='absolute top-1/4 right-0 w-96 h-96 bg-primary-green/5 rounded-full blur-3xl'></div>
      <div className='absolute bottom-1/4 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl'></div>

      <div className='container mx-auto px-4 relative z-10'>
        <SectionHeader
          title='Life@'
          highlight='JKKN'
          subtitle='Experience a vibrant campus life filled with learning, growth, and unforgettable memories'
        />

        {/* Life Categories Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16'>
          {lifeCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className='group relative'
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color} rounded-2xl opacity-0 group-hover:opacity-90 transition-opacity duration-300`}></div>
              <div className='relative bg-white border-2 border-gray-100 rounded-2xl p-6 group-hover:border-transparent transition-all duration-300'>
                <div className='w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors'>
                  <category.icon className='text-3xl text-gray-600 group-hover:text-white transition-colors' />
                </div>
                <h3 className='text-lg font-bold text-gray-900 mb-2 group-hover:text-white transition-colors'>
                  {category.title}
                </h3>
                <p className='text-sm text-gray-600 group-hover:text-white/90 transition-colors'>
                  {category.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
