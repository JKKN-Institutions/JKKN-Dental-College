'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import SectionHeader from './ui/SectionHeader';
import LogoLoop from './ui/LogoLoop';

const partners = [
  { id: 1, name: 'Amazon', logo: '/images/amazon.png' },
  { id: 2, name: 'IBM', logo: '/images/IBM.png' },
  { id: 3, name: 'Oracle', logo: '/images/Oracle.png' },
  { id: 4, name: 'Amazon', logo: '/images/amazon.png' },
  { id: 5, name: 'IBM', logo: '/images/IBM.png' },
  { id: 6, name: 'Oracle', logo: '/images/Oracle.png' }
];

export default function SupportingPartners() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section
      id='partners'
      ref={ref}
      className='py-20 bg-white relative overflow-hidden'
    >
      <div className='container mx-auto px-4 relative z-10'>
        <SectionHeader
          title='Supporting'
          highlight='Partners'
          subtitle='Collaborating with leading organizations to provide world-class opportunities and resources'
        />

        {/* Infinite Logo Loop */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <LogoLoop logos={partners} speed={25} direction="left" />
        </motion.div>
      </div>
    </section>
  );
}
