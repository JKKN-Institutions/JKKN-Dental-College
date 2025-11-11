'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import Image from 'next/image';
import { HiClock, HiTag } from 'react-icons/hi';
import SectionHeader from './ui/SectionHeader';

const newsItems = [
  {
    id: 1,
    image: '/images/jkkn institution.jpeg',
    category: 'Academic',
    title: 'JKKN Receives NAAC A+ Accreditation',
    description:
      'Our institution has been awarded NAAC A+ accreditation, recognizing our commitment to quality education and excellence in all aspects of academic delivery.',
    date: 'January 15, 2025',
    featured: true
  },
  {
    id: 2,
    image: '/images/achievement image.jpeg',
    category: 'Achievement',
    title: 'Students Win National Level Hackathon',
    description:
      'JKKN students secured first place in the national hackathon, showcasing innovation and technical prowess.',
    date: 'January 10, 2025',
    featured: false
  },
  {
    id: 3,
    image: '/images/college infrastructure.jpeg',
    category: 'Infrastructure',
    title: 'New Research Lab Inaugurated',
    description:
      'State-of-the-art research laboratory with cutting-edge equipment inaugurated to enhance research capabilities.',
    date: 'January 5, 2025',
    featured: false
  },
  {
    id: 4,
    image: '/images/placement image.jpeg',
    category: 'Placement',
    title: 'Record Breaking Placement Season 2024-25',
    description:
      '95% placement rate achieved with top companies offering excellent packages to our talented students.',
    date: 'December 28, 2024',
    featured: false
  },
  {
    id: 5,
    image: '/images/achievement image.jpeg',
    category: 'Recognition',
    title: 'Faculty Receives National Teaching Award',
    description:
      'Dr. Sarah Johnson honored with the prestigious National Teaching Excellence Award for outstanding contribution to education.',
    date: 'December 20, 2024',
    featured: false
  },
  {
    id: 6,
    image: '/images/college infrastructure.jpeg',
    category: 'Collaboration',
    title: 'MoU Signed with Leading Tech Companies',
    description:
      'Strategic partnerships established with industry leaders to provide better opportunities for our students.',
    date: 'December 15, 2024',
    featured: false
  }
];

export default function CollegeNews() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [isPaused, setIsPaused] = useState(false);

  const handleTouchStart = () => {
    setIsPaused(true);
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
  };

  return (
    <section
      id='news'
      ref={ref}
      className='py-8 sm:py-12 md:py-16 bg-gradient-to-b from-white to-primary-cream/30 relative overflow-hidden'
    >
      {/* Decorative Elements */}
      <div className='absolute top-0 left-1/4 w-64 h-64 bg-primary-green/5 rounded-full blur-3xl'></div>

      <div className='container mx-auto px-4 relative z-10'>
        <SectionHeader
          title='College'
          highlight='News'
          subtitle='Stay updated with the latest happenings, achievements, and announcements from JKKN Institution'
        />

        {/* Auto-scrolling News Cards Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className='relative'
        >
          <div className='overflow-hidden'>
            <motion.div
              animate={!isPaused ? { x: [0, -2000] } : {}}
              transition={
                !isPaused
                  ? {
                      x: {
                        repeat: Infinity,
                        repeatType: 'loop',
                        duration: 30,
                        ease: 'linear'
                      }
                    }
                  : {}
              }
              onHoverStart={() => setIsPaused(true)}
              onHoverEnd={() => setIsPaused(false)}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className='flex gap-4 sm:gap-6 pb-4'
            >
              {/* Duplicate items for seamless loop */}
              {[...newsItems, ...newsItems, ...newsItems].map((news, index) => (
                <motion.div
                  key={`${news.id}-${index}`}
                  initial={{ opacity: 0, x: 50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: (index % newsItems.length) * 0.1 }}
                  className='w-[85vw] min-w-[260px] max-w-[340px] sm:w-[320px] md:w-[340px] group flex-shrink-0'
                >
                  <div className='bg-white rounded-2xl overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg'>
                    {/* Image */}
                    <div className='relative h-40 sm:h-48 md:h-56 bg-gradient-to-br from-primary-green/10 to-primary-green/5 overflow-hidden'>
                      <Image
                        src={news.image}
                        alt={news.title}
                        fill
                        className='object-cover transition-transform duration-300 group-hover:scale-110'
                        sizes='(max-width: 640px) 85vw, (max-width: 768px) 320px, 340px'
                        draggable={false}
                      />
                      {/* Category Badge */}
                      <div className='absolute top-3 left-3 sm:top-4 sm:left-4 z-10'>
                        <span className='bg-primary-green text-white px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2 shadow-lg'>
                          <HiTag className='text-xs sm:text-sm' />
                          {news.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className='p-3 sm:p-4 md:p-6 flex flex-col flex-1'>
                      <div className='flex items-center gap-2 mb-2 text-gray-500'>
                        <HiClock className='text-sm' />
                        <span className='text-xs sm:text-sm'>{news.date}</span>
                      </div>
                      <h3 className='text-base sm:text-lg md:text-xl font-bold text-primary-green leading-tight line-clamp-2'>
                        {news.title}
                      </h3>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
