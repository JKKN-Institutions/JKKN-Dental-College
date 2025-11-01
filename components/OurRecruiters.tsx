'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import SectionHeader from './ui/SectionHeader';
import Carousel from './ui/Carousel';
import ElectricWave from './ui/ElectricWave';

const topRecruiters = [
  { id: 1, name: 'Amazon', logo: '/images/amazon.png', package: '12 LPA' },
  { id: 2, name: 'IBM', logo: '/images/IBM.png', package: '10 LPA' },
  { id: 3, name: 'Oracle', logo: '/images/Oracle.png', package: '11 LPA' },
  { id: 4, name: 'Amazon', logo: '/images/amazon.png', package: '12 LPA' },
  { id: 5, name: 'IBM', logo: '/images/IBM.png', package: '10 LPA' },
  { id: 6, name: 'Oracle', logo: '/images/Oracle.png', package: '11 LPA' },
  { id: 7, name: 'Amazon', logo: '/images/amazon.png', package: '12 LPA' },
  { id: 8, name: 'IBM', logo: '/images/IBM.png', package: '10 LPA' },
  { id: 9, name: 'Oracle', logo: '/images/Oracle.png', package: '11 LPA' }
];

export default function OurRecruiters() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section
      id='recruiters'
      ref={ref}
      className='py-20 bg-gradient-to-b from-primary-cream/30 to-white relative overflow-hidden'
    >
      {/* Decorative Elements */}
      <div className='absolute top-1/3 right-0 w-96 h-96 bg-primary-green/5 rounded-full blur-3xl'></div>

      <div className='container mx-auto px-4 relative z-10'>
        <SectionHeader
          title='Our College'
          highlight='Recruiters'
          subtitle='Top companies trust JKKN graduates for their talent, skills, and dedication'
        />

        {/* Recruiters Carousel */}
        <div className='bg-white rounded-3xl shadow-2xl p-8 md:p-12'>
          <h3 className='text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8'>
            Top Recruiting Companies
          </h3>
          <Carousel
            autoPlay={true}
            autoPlayInterval={3000}
            showArrows={true}
            showDots={true}
            itemsPerView={{ mobile: 2, tablet: 4, desktop: 6 }}
            gap={24}
            className='px-12'
          >
            {topRecruiters.map((recruiter, index) => (
              <motion.div
                key={`${recruiter.name}-${recruiter.id}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className='group'
              >
                <div className='bg-gray-50 border-2 border-gray-100 rounded-xl p-4 flex flex-col items-center justify-center h-44 hover:border-primary-green hover:shadow-lg hover:bg-white transition-all duration-300 hover:-translate-y-1 relative overflow-hidden'>
                  {/* Electric Wave Effect */}
                  <ElectricWave variant="white" position="bottom" opacity={0.25} />
                  {/* Logo */}
                  <div className='w-24 h-20 mb-3 bg-white rounded-lg flex items-center justify-center group-hover:bg-primary-green/10 transition-colors shadow-sm p-2'>
                    <div className='relative w-full h-full'>
                      <Image
                        src={recruiter.logo}
                        alt={`${recruiter.name} logo`}
                        width={100}
                        height={60}
                        className='object-contain grayscale group-hover:grayscale-0 transition-all duration-300'
                      />
                    </div>
                  </div>
                  {/* Company Name */}
                  <p className='text-sm font-semibold text-gray-800 mb-1 group-hover:text-primary-green transition-colors'>
                    {recruiter.name}
                  </p>
                  {/* Package */}
                  <div className='bg-primary-green/10 px-3 py-1 rounded-full'>
                    <p className='text-xs text-primary-green font-bold'>
                      ₹ {recruiter.package}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </Carousel>
        </div>

      </div>
    </section>
  );
}
