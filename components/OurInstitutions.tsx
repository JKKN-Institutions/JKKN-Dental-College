'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import SectionHeader from './ui/SectionHeader';
import Carousel from './ui/Carousel';
import ElectricWave from './ui/ElectricWave';

const institutions = [
  {
    id: 1,
    name: 'JKKN College of Engineering & Technology',
    image: '/images/Engineering college.webp',
    description: 'Premier engineering education with state-of-the-art facilities'
  },
  {
    id: 2,
    name: 'JKKN Dental College & Hospital',
    image: '/images/Dental college.webp',
    description: 'Comprehensive dental education and patient care'
  },
  {
    id: 3,
    name: 'JKKN College of Pharmacy',
    image: '/images/pharmacy college.webp',
    description: 'Excellence in pharmaceutical education and research'
  },
  {
    id: 4,
    name: 'JKKN College of Arts & Science',
    image: '/images/Arts College.webp',
    description: 'Holistic education in arts and sciences'
  },
  {
    id: 5,
    name: 'JKKN College of Allied Health Sciences',
    image: '/images/Allied Health Science.webp',
    description: 'Training future healthcare professionals'
  },
  {
    id: 6,
    name: 'JKKN Higher Secondary School',
    image: '/images/higher secondary school.webp',
    description: 'Foundation for academic excellence'
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
              <div className='bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2 cursor-pointer h-full flex flex-col relative'>
                {/* Electric Wave Effect */}
                <ElectricWave variant="green" position="bottom" opacity={0.4} />

                {/* Image */}
                <div className='relative h-64 bg-gradient-to-br from-primary-green/10 to-primary-green/5 overflow-hidden'>
                  <Image
                    src={institution.image}
                    alt={institution.name}
                    fill
                    className='object-cover group-hover:scale-110 transition-transform duration-500'
                    sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                </div>

                {/* College Info */}
                <div className='p-6 text-center flex-1 flex flex-col justify-between'>
                  <div>
                    <h3 className='text-xl font-bold text-gray-900 group-hover:text-primary-green transition-colors leading-tight mb-3'>
                      {institution.name}
                    </h3>
                    <p className='text-sm text-gray-600 line-clamp-2'>
                      {institution.description}
                    </p>
                  </div>
                  <button className='mt-4 text-primary-green font-semibold text-sm hover:underline'>
                    Learn More →
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </Carousel>
      </div>
    </section>
  );
}
