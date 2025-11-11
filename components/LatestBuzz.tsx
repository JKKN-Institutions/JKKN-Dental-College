'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { HiTrendingUp, HiSparkles, HiUserGroup, HiAcademicCap } from 'react-icons/hi';
import SectionHeader from './ui/SectionHeader';
import ElectricWave from './ui/ElectricWave';
import Carousel from './ui/Carousel';

const buzzItems = [
  {
    id: 1,
    icon: HiAcademicCap,
    image: '/images/placement image.jpeg',
    title: 'Campus Recruitment Drive 2025',
    category: 'Placement'
  },
  {
    id: 2,
    icon: HiTrendingUp,
    image: '/images/marathon image.jpeg',
    title: 'JKKN Marathon 2025',
    category: 'Sports'
  },
  {
    id: 3,
    icon: HiUserGroup,
    image: '/images/alumni meet.jpeg',
    title: 'Alumni Meet 2025',
    category: 'Alumni'
  },
  {
    id: 4,
    icon: HiSparkles,
    image: '/images/pongal celebration.jpeg',
    title: 'Pongal Celebration',
    category: 'Cultural'
  },
  {
    id: 5,
    icon: HiSparkles,
    image: '/images/onam celebration.jpeg',
    title: 'Onam Celebration',
    category: 'Cultural'
  }
];

export default function LatestBuzz() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section
      id='buzz'
      ref={ref}
      className='py-20 bg-white relative overflow-hidden'
    >
      {/* Decorative Elements */}
      <div className='absolute top-1/4 right-0 w-96 h-96 bg-primary-green/5 rounded-full blur-3xl'></div>
      <div className='absolute bottom-1/4 left-0 w-96 h-96 bg-primary-green/5 rounded-full blur-3xl'></div>

      <div className='container mx-auto px-4 relative z-10'>
        <SectionHeader
          title='Latest'
          highlight='Buzz'
          subtitle="What's trending at JKKN - Stay connected with the most exciting updates and announcements"
        />

        {/* Buzz Cards Carousel */}
        <Carousel
          autoPlay={true}
          autoPlayInterval={3500}
          showArrows={false}
          showDots={false}
          itemsPerView={{ mobile: 1, tablet: 2, desktop: 3 }}
          gap={32}
          className='mb-12'
        >
          {buzzItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className='group'
            >
              <div className='bg-white rounded-xl shadow-lg transition-all duration-300 overflow-hidden cursor-pointer h-full flex flex-col'>
                {/* Image */}
                <div className='relative h-56 bg-gradient-to-br from-primary-green/10 to-primary-green/5 overflow-hidden'>
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className='object-cover transition-transform duration-300 group-hover:scale-110'
                    sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
                  />
                  {/* Category Badge */}
                  <div className='absolute top-4 right-4 bg-primary-green text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg z-10'>
                    {item.category}
                  </div>
                </div>

                {/* Content */}
                <div className='p-4 text-center'>
                  <h3 className='text-lg font-bold text-gray-900 group-hover:text-primary-green transition-colors duration-300 leading-tight line-clamp-2'>
                    {item.title}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </Carousel>
      </div>
    </section>
  );
}
