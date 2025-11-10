'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import SectionHeader from './ui/SectionHeader';

const institutions = [
  {
    id: 1,
    name: 'JKKN Dental College and Hospital',
    image: '/images/Dental college.webp',
    description: 'Comprehensive dental education and patient care'
  },
  {
    id: 2,
    name: 'JKKN Allied Health Science',
    image: '/images/Allied Health Science.webp',
    description: 'Training future healthcare professionals'
  },
  {
    id: 3,
    name: 'JKKN College of Pharmacy',
    image: '/images/pharmacy college.webp',
    description: 'Excellence in pharmaceutical education and research'
  },
  {
    id: 4,
    name: 'Sresakthimayeil Institute of Nursing and Research',
    image: '/images/nursing.webp',
    description: 'Excellence in nursing education and research'
  },
  {
    id: 5,
    name: 'JKKN College of Engineering and Technology',
    image: '/images/Engineering college.webp',
    description: 'Premier engineering education with state-of-the-art facilities'
  },
  {
    id: 6,
    name: 'JKKN College of Arts and Science',
    image: '/images/Arts College.webp',
    description: 'Holistic education in arts and sciences'
  },
  {
    id: 7,
    name: 'JKKN College of Education',
    image: '/images/education.webp',
    description: 'Shaping future educators'
  },
  {
    id: 8,
    name: 'JKKN Matriculation Higher Secondary School',
    image: '/images/higher secondary school.webp',
    description: 'Foundation for academic excellence'
  },
  {
    id: 9,
    name: 'Nattraja Vidhyalya',
    image: '/images/nattraja.webp',
    description: 'Quality education from the foundation'
  }
];

export default function OurInstitutions() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

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

        {/* Institutions Cards Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'>
          {institutions.map((institution, index) => (
            <motion.div
              key={institution.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className='group'
            >
              <div className='bg-white rounded-2xl shadow-xl transition-all duration-300 overflow-hidden cursor-pointer h-full flex flex-col'>
                {/* Image */}
                <div className='relative h-64 bg-gradient-to-br from-primary-green/10 to-primary-green/5 overflow-hidden'>
                  <Image
                    src={institution.image}
                    alt={institution.name}
                    fill
                    className='object-cover transition-transform duration-300 group-hover:scale-110'
                    sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
                  />
                </div>

                {/* Title Only */}
                <div className='p-6 text-center'>
                  <h3 className='text-xl font-bold text-gray-900 group-hover:text-primary-green transition-colors duration-300 leading-tight'>
                    {institution.name}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
