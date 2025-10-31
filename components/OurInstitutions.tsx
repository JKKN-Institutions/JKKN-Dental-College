'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import SectionHeader from './ui/SectionHeader';
import Carousel from './ui/Carousel';

const institutions = [
  {
    id: 1,
    name: 'JKKN College of Engineering & Technology',
    image: 'engineering-college.jpg'
  },
  {
    id: 2,
    name: 'JKKN Dental College & Hospital',
    image: 'dental-college.jpg'
  },
  {
    id: 3,
    name: 'JKKN College of Pharmacy',
    image: 'pharmacy-college.jpg'
  },
  {
    id: 4,
    name: 'JKKN College of Arts & Science',
    image: 'arts-science-college.jpg'
  },
  {
    id: 5,
    name: 'JKKN College of Allied Health Sciences',
    image: 'allied-health-college.jpg'
  },
  {
    id: 6,
    name: 'JKKN School of Management',
    image: 'management-college.jpg'
  }
];

export default function OurInstitutions() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id='institutions'
      ref={ref}
      className='py-20 bg-gradient-to-b from-white via-primary-cream/20 to-white relative overflow-hidden'
    >
      {/* Decorative Elements */}
      <div className='absolute top-1/4 left-0 w-96 h-96 bg-primary-green/5 rounded-full blur-3xl'></div>
      <div className='absolute bottom-1/4 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl'></div>

      <div className='container mx-auto px-4 relative z-10'>
        <SectionHeader
          title='Our JKKN'
          highlight='Institutions'
          subtitle='A family of premier educational institutions committed to excellence'
        />

        {/* Institutions Carousel */}
        <Carousel
          autoPlay={true}
          autoPlayInterval={4000}
          showArrows={true}
          showDots={true}
          itemsPerView={{ mobile: 1, tablet: 2, desktop: 3 }}
          gap={32}
          className='px-12'
        >
          {institutions.map((institution, index) => (
            <motion.div
              key={institution.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className='group'
            >
              <div className='bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2 cursor-pointer'>
                {/* Image */}
                <div className='relative h-64 bg-gradient-to-br from-primary-green/10 to-primary-green/5 overflow-hidden'>
                  <div className='w-full h-full flex items-center justify-center text-gray-400 group-hover:scale-105 transition-transform duration-500'>
                    <span className='text-sm'>Image: {institution.image}</span>
                  </div>
                </div>

                {/* College Name */}
                <div className='p-6 text-center'>
                  <h3 className='text-xl font-bold text-gray-900 group-hover:text-primary-green transition-colors leading-tight'>
                    {institution.name}
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
