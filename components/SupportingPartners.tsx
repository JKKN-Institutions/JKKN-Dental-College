'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import SectionHeader from './ui/SectionHeader';
import Carousel from './ui/Carousel';

const partners = [
  { id: 1, name: 'Google', logo: 'google-logo.png' },
  { id: 2, name: 'Microsoft', logo: 'microsoft-logo.png' },
  { id: 3, name: 'Amazon', logo: 'amazon-logo.png' },
  { id: 4, name: 'IBM', logo: 'ibm-logo.png' },
  { id: 5, name: 'Intel', logo: 'intel-logo.png' },
  { id: 6, name: 'Oracle', logo: 'oracle-logo.png' },
  { id: 7, name: 'SAP', logo: 'sap-logo.png' },
  { id: 8, name: 'Cisco', logo: 'cisco-logo.png' },
  { id: 9, name: 'Adobe', logo: 'adobe-logo.png' },
  { id: 10, name: 'Salesforce', logo: 'salesforce-logo.png' },
  { id: 11, name: 'Dell', logo: 'dell-logo.png' },
  { id: 12, name: 'HP', logo: 'hp-logo.png' }
];

export default function SupportingPartners() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

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

        {/* Partners Carousel */}
        <Carousel
          autoPlay={true}
          autoPlayInterval={3000}
          showArrows={true}
          showDots={true}
          itemsPerView={{ mobile: 2, tablet: 4, desktop: 6 }}
          gap={24}
          className='px-12'
        >
          {partners.map((partner, index) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className='group'
            >
              <div className='bg-white border-2 border-gray-100 rounded-xl p-6 flex items-center justify-center h-32 hover:border-primary-green hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
                <div className='text-center'>
                  <div className='w-20 h-20 mx-auto mb-2 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-primary-green/10 transition-colors duration-300'>
                    <span className='text-xs text-gray-400 group-hover:text-primary-green font-medium'>
                      {partner.name}
                    </span>
                  </div>
                  <p className='text-xs font-semibold text-gray-600 group-hover:text-primary-green transition-colors'>
                    {partner.name}
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
