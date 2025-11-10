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
  const constraintsRef = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [isDragging, setIsDragging] = useState(false);

  return (
    <section
      id='news'
      ref={ref}
      className='py-20 bg-gradient-to-b from-white to-primary-cream/30 relative overflow-hidden'
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
          <div className='overflow-hidden' ref={constraintsRef}>
            <motion.div
              drag='x'
              dragConstraints={constraintsRef}
              dragElastic={0.1}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={() => setIsDragging(false)}
              animate={!isDragging ? { x: [0, -2400] } : {}}
              transition={
                !isDragging
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
              className='flex gap-6 pb-4 cursor-grab active:cursor-grabbing'
            >
              {/* Duplicate items for seamless loop */}
              {[...newsItems, ...newsItems].map((news, index) => (
                <motion.div
                  key={`${news.id}-${index}`}
                  initial={{ opacity: 0, x: 50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: (index % newsItems.length) * 0.1 }}
                  className='min-w-[280px] sm:min-w-[320px] group flex-shrink-0'
                >
                  <div className='bg-white rounded-2xl shadow-xl overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-2xl'>
                    {/* Image */}
                    <div className='relative h-56 bg-gradient-to-br from-primary-green/10 to-primary-green/5 overflow-hidden'>
                      <Image
                        src={news.image}
                        alt={news.title}
                        fill
                        className='object-cover transition-transform duration-300 group-hover:scale-110'
                        sizes='400px'
                        draggable={false}
                      />
                      {/* Category Badge */}
                      <div className='absolute top-4 left-4 z-10'>
                        <span className='bg-primary-green text-white px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg'>
                          <HiTag className='text-sm' />
                          {news.category}
                        </span>
                      </div>
                    </div>

                    {/* Content - Title Only */}
                    <div className='p-6 flex flex-col'>
                      <div className='flex items-center gap-2 mb-3 text-gray-500'>
                        <HiClock className='text-sm' />
                        <span className='text-sm'>{news.date}</span>
                      </div>
                      <h3 className='text-xl font-bold text-gray-900 leading-tight group-hover:text-primary-green transition-colors duration-300'>
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
