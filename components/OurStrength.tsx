'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

interface StatItem {
  number: number;
  suffix: string;
  label: string;
}

const stats: StatItem[] = [
  { number: 25, suffix: '+', label: 'Years of Excellence' },
  { number: 5000, suffix: '+', label: 'Students' },
  { number: 95, suffix: '%', label: 'Placement Rate' },
  { number: 50, suffix: '+', label: 'Courses Offered' },
  { number: 200, suffix: '+', label: 'Expert Faculty' },
  { number: 500, suffix: '+', label: 'Industry Partners' }
];

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default function OurStrength() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section
      id='strength'
      ref={ref}
      className='py-8 sm:py-12 md:py-16 bg-gradient-to-br from-primary-green to-primary-green/90 text-white relative overflow-hidden'
    >
      {/* Decorative Pattern */}
      <div className='absolute inset-0 opacity-10'>
        <div className='absolute top-10 left-10 w-32 h-32 border-4 border-white rounded-full'></div>
        <div className='absolute bottom-10 right-10 w-48 h-48 border-4 border-white rounded-full'></div>
        <div className='absolute top-1/2 left-1/4 w-24 h-24 border-4 border-white rounded-full'></div>
      </div>

      <div className='container mx-auto px-4 relative z-10'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className='text-center mb-12 sm:mb-16'
        >
          <h2 className='text-3xl xs:text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 px-4'>
            Our Strength
          </h2>
          <p className='text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto px-4'>
            Numbers that speak volumes about our commitment to excellence
          </p>
        </motion.div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'>
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className='bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:bg-white/20 transition-all duration-300 hover:scale-105 border border-white/20'
            >
              <div className='text-5xl md:text-6xl font-bold mb-4'>
                <Counter target={stat.number} suffix={stat.suffix} />
              </div>
              <div className='text-lg md:text-xl font-medium text-white/90'>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className='text-center mt-12'
        >
          <p className='text-lg md:text-xl text-white/80 italic'>
            Building futures, shaping leaders, creating excellence
          </p>
        </motion.div>
      </div>
    </section>
  );
}
