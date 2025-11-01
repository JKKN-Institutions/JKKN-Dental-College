'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import SectionHeader from './ui/SectionHeader';
import Carousel from './ui/Carousel';
import ElectricWave from './ui/ElectricWave';

const lifeAspects = [
  {
    id: 1,
    title: 'Sports & Athletics',
    image: '/images/sports.jpeg',
    description: 'State-of-the-art sports facilities for cricket, football, basketball, volleyball, and more. Experience a world-class athletic environment.'
  },
  {
    id: 2,
    title: 'Modern Facilities',
    image: '/images/facilities.jpeg',
    description: 'Well-equipped infrastructure with latest technology and amenities. Our campus offers everything students need for a comfortable experience.'
  },
  {
    id: 3,
    title: 'Smart Classrooms',
    image: '/images/classroom.jpeg',
    description: 'Interactive learning spaces with modern teaching aids, digital boards, and technology-enabled education for enhanced learning.'
  },
  {
    id: 4,
    title: 'Hostel Accommodation',
    image: '/images/hostel.jpeg',
    description: 'Comfortable and secure hostel facilities with all essential amenities, mess, WiFi, and 24/7 security for a safe living environment.'
  }
];

export default function LifeAtJKKN() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

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

        {/* Campus Life Carousel */}
        <Carousel
          autoPlay={true}
          autoPlayInterval={3500}
          showArrows={true}
          showDots={true}
          itemsPerView={{ mobile: 1, tablet: 2, desktop: 3 }}
          gap={32}
          className='mb-12 px-12'
        >
          {lifeAspects.map((aspect, index) => (
            <motion.div
              key={aspect.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className='group h-full'
            >
              <div className='relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white h-full flex flex-col'>
                {/* Electric Wave Effect */}
                <ElectricWave variant="yellow" position="bottom" opacity={0.35} />
                {/* Image */}
                <div className='relative h-72 overflow-hidden flex-shrink-0'>
                  <Image
                    src={aspect.image}
                    alt={aspect.title}
                    fill
                    className='object-cover group-hover:scale-110 transition-transform duration-500'
                    sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent'></div>

                  {/* Title Overlay */}
                  <div className='absolute bottom-0 left-0 right-0 p-6'>
                    <h3 className='text-2xl md:text-3xl font-bold text-white drop-shadow-lg'>
                      {aspect.title}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <div className='p-6 bg-white flex-1'>
                  <p className='text-gray-600 leading-relaxed'>
                    {aspect.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </Carousel>

      </div>
    </section>
  );
}
