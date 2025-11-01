'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { HiArrowRight, HiClock, HiTag } from 'react-icons/hi';
import SectionHeader from './ui/SectionHeader';
import Button from './ui/Button';
import NewsLoop from './ui/NewsLoop';

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

        {/* Featured News */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className='mb-12'
        >
          <div className='bg-gradient-to-r from-primary-green to-primary-green/90 rounded-3xl overflow-hidden shadow-2xl'>
            <div className='grid grid-cols-1 lg:grid-cols-2'>
              <div className='relative h-64 lg:h-auto bg-white/10 overflow-hidden min-h-[400px]'>
                <Image
                  src={newsItems[0].image}
                  alt={newsItems[0].title}
                  fill
                  className='object-cover'
                  sizes='(max-width: 1024px) 100vw, 50vw'
                  priority
                />
                <div className='absolute inset-0 bg-gradient-to-r from-primary-green/40 to-transparent'></div>
              </div>
              <div className='p-8 lg:p-12 text-white flex flex-col justify-center'>
                <div className='flex items-center gap-3 mb-4'>
                  <span className='bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-medium flex items-center gap-2'>
                    <HiTag className='text-sm' />
                    {newsItems[0].category}
                  </span>
                  <span className='flex items-center gap-2 text-sm text-white/80'>
                    <HiClock className='text-sm' />
                    {newsItems[0].date}
                  </span>
                </div>
                <h3 className='text-3xl md:text-4xl font-bold mb-4'>
                  {newsItems[0].title}
                </h3>
                <p className='text-lg text-white/90 mb-6 leading-relaxed'>
                  {newsItems[0].description}
                </p>
                <div>
                  <Button variant='secondary' size='md'>
                    Read More <HiArrowRight className='ml-2' />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Infinite News Loop */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <NewsLoop newsItems={newsItems.slice(1)} speed={30} direction="left" />
        </motion.div>
      </div>
    </section>
  );
}
