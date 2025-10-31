'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import {
  HiAcademicCap,
  HiTrendingUp,
  HiUserGroup,
  HiLightningBolt
} from 'react-icons/hi';
import SectionHeader from './ui/SectionHeader';
import Image from 'next/image';

const highlights = [
  {
    icon: HiAcademicCap,
    title: 'Quality Education',
    description:
      'JKKN Institution has been a beacon of quality education for over 25 years, nurturing minds and building futures.'
  },
  {
    icon: HiTrendingUp,
    title: 'Consistent Growth',
    description:
      'Our commitment to excellence has led to consistent growth in academic achievements and industry recognition.'
  },
  {
    icon: HiUserGroup,
    title: 'Strong Community',
    description:
      'A vibrant community of students, faculty, and alumni working together towards academic and professional success.'
  },
  {
    icon: HiLightningBolt,
    title: 'Innovation Hub',
    description:
      'Fostering innovation and creativity through state-of-the-art infrastructure and research facilities.'
  }
];

export default function AboutJKKN() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section
      id='about'
      ref={ref}
      className='py-20 bg-white relative overflow-hidden'
    >
      {/* Decorative Elements */}
      <div className='absolute top-20 right-0 w-72 h-72 bg-primary-green/5 rounded-full blur-3xl'></div>
      <div className='absolute bottom-20 left-0 w-72 h-72 bg-primary-cream/50 rounded-full blur-3xl'></div>

      <div className='container mx-auto px-4 relative z-10'>
        <SectionHeader
          title='About'
          highlight='JKKN Institution'
          subtitle='A legacy of excellence in education, shaping futures and transforming lives'
        />

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16'>
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
            className='space-y-6'
          >
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className='text-2xl md:text-3xl font-bold text-gray-900'
            >
              Building Excellence Since 1998
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className='text-gray-700 leading-relaxed text-lg'
            >
              JKKN Institution stands as a pioneering educational institution
              committed to providing world-class education and holistic
              development. With a rich legacy spanning over two decades, we have
              consistently delivered excellence in academics, research, and
              character building.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className='text-gray-700 leading-relaxed text-lg'
            >
              Our institution is built on the foundation of integrity,
              innovation, and inclusivity. We believe in nurturing not just
              students, but future leaders who will make a positive impact on
              society.
            </motion.p>
          </motion.div>

          {/* JKKN Institution Image Card */}
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ duration: 0.8, type: "spring", bounce: 0.3, delay: 0.2 }}
            className='relative group'
          >
            <div className='relative rounded-2xl overflow-hidden bg-white shadow-2xl'>
              {/* Image */}
              <div className='aspect-[4/3] relative bg-gradient-to-br from-primary-green/10 to-primary-cream/50'>
                <Image
                  src='/images/jkkn institution.jpeg'
                  alt='JKKN Institution'
                  fill
                  className='object-cover group-hover:scale-110 transition-transform duration-700'
                  priority
                />
                {/* Overlay Gradient */}
                <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
              </div>

              {/* Floating Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.6, type: "spring" }}
                className='absolute top-4 right-4 bg-primary-green text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg z-10'
              >
                Est. 1998
              </motion.div>

              {/* Bottom Info Bar */}
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={isInView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
                className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-10'
              >
                <h4 className='text-xl font-bold mb-1'>JKKN Institution</h4>
                <p className='text-sm opacity-90'>Premier Educational Excellence</p>
              </motion.div>
            </div>

            {/* Decorative Ring */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={isInView ? { scale: 1, rotate: 0 } : {}}
              transition={{ duration: 1, delay: 0.4, type: "spring" }}
              className='absolute -bottom-4 -right-4 w-24 h-24 border-4 border-primary-green/30 rounded-full -z-10'
            ></motion.div>
          </motion.div>
        </div>

        {/* Highlight Cards with Brand Logo on Hover */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {highlights.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                type: "spring",
                bounce: 0.4
              }}
              onHoverStart={() => setHoveredCard(index)}
              onHoverEnd={() => setHoveredCard(null)}
              className='relative group'
            >
              <div className='bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary-green h-full overflow-hidden'>
                {/* Background Pattern */}
                <div className='absolute top-0 right-0 w-32 h-32 bg-primary-green/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700'></div>

                {/* Icon */}
                <motion.div
                  animate={{
                    scale: hoveredCard === index ? [1, 1.2, 1] : 1,
                    rotate: hoveredCard === index ? [0, 5, -5, 0] : 0,
                  }}
                  transition={{ duration: 0.5 }}
                  className='relative w-14 h-14 bg-gradient-to-br from-primary-green to-primary-green/80 rounded-xl flex items-center justify-center mb-4 group-hover:shadow-lg transition-shadow'
                >
                  <item.icon className='text-2xl text-white' />
                </motion.div>

                {/* Content */}
                <h4 className='text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-green transition-colors duration-300'>
                  {item.title}
                </h4>
                <p className='text-gray-600 leading-relaxed text-sm'>
                  {item.description}
                </p>

                {/* Brand Logo Overlay on Hover */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{
                    opacity: hoveredCard === index ? 0.1 : 0,
                    scale: hoveredCard === index ? 1 : 0.5,
                  }}
                  transition={{ duration: 0.3 }}
                  className='absolute inset-0 flex items-center justify-center pointer-events-none'
                >
                  <div className='w-32 h-32 flex items-center justify-center'>
                    <span className='text-6xl font-bold text-primary-green'>JKKN</span>
                  </div>
                </motion.div>

                {/* Shine Effect */}
                <motion.div
                  animate={{
                    x: hoveredCard === index ? ['-100%', '200%'] : '-100%',
                  }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12'
                ></motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
