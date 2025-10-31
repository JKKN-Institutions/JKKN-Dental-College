'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import SectionHeader from './ui/SectionHeader';
import Carousel from './ui/Carousel';

const topRecruiters = [
  { id: 1, name: 'TCS', logo: 'tcs-logo.png', package: '7 LPA' },
  { id: 2, name: 'Infosys', logo: 'infosys-logo.png', package: '6.5 LPA' },
  { id: 3, name: 'Wipro', logo: 'wipro-logo.png', package: '6 LPA' },
  { id: 4, name: 'Cognizant', logo: 'cognizant-logo.png', package: '5.5 LPA' },
  { id: 5, name: 'Accenture', logo: 'accenture-logo.png', package: '8 LPA' },
  { id: 6, name: 'Capgemini', logo: 'capgemini-logo.png', package: '6.5 LPA' },
  { id: 7, name: 'Tech Mahindra', logo: 'tech-mahindra-logo.png', package: '5 LPA' },
  { id: 8, name: 'HCL', logo: 'hcl-logo.png', package: '5.5 LPA' },
  { id: 9, name: 'L&T Infotech', logo: 'lti-logo.png', package: '7 LPA' },
  { id: 10, name: 'Zoho', logo: 'zoho-logo.png', package: '6 LPA' },
  { id: 11, name: 'Amazon', logo: 'amazon-logo.png', package: '12 LPA' },
  { id: 12, name: 'Google', logo: 'google-logo.png', package: '18 LPA' }
];

export default function OurRecruiters() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

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
                key={recruiter.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className='group'
              >
                <div className='bg-gray-50 border-2 border-gray-100 rounded-xl p-4 flex flex-col items-center justify-center h-36 hover:border-primary-green hover:shadow-lg hover:bg-white transition-all duration-300 hover:-translate-y-1'>
                  <div className='w-16 h-16 mb-2 bg-white rounded-lg flex items-center justify-center group-hover:bg-primary-green/10 transition-colors shadow-sm'>
                    <span className='text-xs text-gray-600 group-hover:text-primary-green font-bold text-center'>
                      {recruiter.name}
                    </span>
                  </div>
                  <p className='text-xs font-semibold text-gray-800 mb-1'>
                    {recruiter.name}
                  </p>
                  <p className='text-xs text-primary-green font-bold'>
                    {recruiter.package}
                  </p>
                </div>
              </motion.div>
            ))}
          </Carousel>
        </div>

      </div>
    </section>
  );
}
