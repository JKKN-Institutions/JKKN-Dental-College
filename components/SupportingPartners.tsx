'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { HiRefresh, HiOfficeBuilding } from 'react-icons/hi';
import SectionHeader from './ui/SectionHeader';
import LogoLoop from './ui/LogoLoop';
import { getActivePartners } from '@/app/admin/content/sections/[id]/edit/_actions/partners-actions';

type PartnerLogo = {
  id: number;
  name: string;
  logo: string;
};

export default function SupportingPartners() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [partners, setPartners] = useState<PartnerLogo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPartners() {
      setIsLoading(true);
      const result = await getActivePartners();
      if (result.success && result.data) {
        // Map to format expected by LogoLoop component
        const mappedPartners: PartnerLogo[] = result.data.map((partner, index) => ({
          id: index,
          name: partner.name,
          logo: partner.logo_url
        }));
        setPartners(mappedPartners);
      }
      setIsLoading(false);
    }
    loadPartners();
  }, []);

  return (
    <section
      id='partners'
      ref={ref}
      className='py-8 sm:py-12 md:py-16 bg-white relative overflow-hidden'
    >
      <div className='container mx-auto px-4 relative z-10'>
        <SectionHeader
          title='Supporting'
          highlight='Partners'
          subtitle='Collaborating with leading organizations to provide world-class opportunities and resources'
        />

        {/* Loading State */}
        {isLoading ? (
          <div className='flex justify-center items-center py-12'>
            <HiRefresh className='w-8 h-8 text-primary-green animate-spin' />
            <span className='ml-3 text-gray-600'>Loading partners...</span>
          </div>
        ) : partners.length === 0 ? (
          /* Empty State */
          <div className='text-center py-12'>
            <HiOfficeBuilding className='w-12 h-12 text-gray-400 mx-auto mb-4' />
            <p className='text-gray-500'>No partners available at the moment.</p>
          </div>
        ) : (
          /* Infinite Logo Loop */
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <LogoLoop logos={partners} speed={10} direction="left" />
          </motion.div>
        )}
      </div>
    </section>
  );
}
