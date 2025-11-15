'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { HiRefresh, HiBriefcase } from 'react-icons/hi';
import SectionHeader from './ui/SectionHeader';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from './ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import ElectricWave from './ui/ElectricWave';
import { getActiveRecruiters, type Recruiter } from '@/app/admin/content/sections/[id]/edit/_actions/recruiters-actions';

export default function OurRecruiters() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [topRecruiters, setTopRecruiters] = useState<Recruiter[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const autoplayPlugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );

  useEffect(() => {
    async function loadRecruiters() {
      setIsLoading(true);
      const result = await getActiveRecruiters();
      if (result.success && result.data) {
        setTopRecruiters(result.data);
      }
      setIsLoading(false);
    }
    loadRecruiters();
  }, []);

  return (
    <section
      id='recruiters'
      ref={ref}
      className='py-8 sm:py-12 md:py-16 bg-gradient-to-b from-primary-cream/30 to-white relative overflow-hidden'
    >
      {/* Decorative Elements */}
      <div className='absolute top-1/3 right-0 w-96 h-96 bg-primary-green/5 rounded-full blur-3xl'></div>

      <div className='container mx-auto px-4 relative z-10'>
        <SectionHeader
          title='Our College'
          highlight='Recruiters'
          subtitle='Top companies trust JKKN graduates for their talent, skills, and dedication'
        />

        {/* Loading State */}
        {isLoading ? (
          <div className='flex justify-center items-center py-12'>
            <HiRefresh className='w-8 h-8 text-primary-green animate-spin' />
            <span className='ml-3 text-gray-600'>Loading recruiters...</span>
          </div>
        ) : topRecruiters.length === 0 ? (
          /* Empty State */
          <div className='text-center py-12 bg-white rounded-3xl shadow-2xl p-8'>
            <HiBriefcase className='w-12 h-12 text-gray-400 mx-auto mb-4' />
            <p className='text-gray-500'>No recruiters available at the moment.</p>
          </div>
        ) : (
          /* Recruiters Carousel */
          <div className='bg-white rounded-3xl shadow-2xl p-8 md:p-12'>
            <h3 className='text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8'>
              Top Recruiting Companies
            </h3>
            <Carousel
              opts={{
                align: 'start',
                loop: true,
              }}
              plugins={[autoplayPlugin.current]}
              className='px-4 md:px-12'
            >
              <CarouselContent className="-ml-4">
                {topRecruiters.map((recruiter, index) => (
                  <CarouselItem key={`${recruiter.name}-${recruiter.id}`} className="pl-4 basis-full md:basis-1/3 lg:basis-1/6">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      className='group h-full'
                    >
                      <div className='bg-gray-50 border-2 border-gray-100 rounded-xl p-4 flex flex-col items-center justify-center aspect-square md:aspect-auto md:h-44 hover:border-primary-green hover:shadow-lg hover:bg-white transition-all duration-300 hover:-translate-y-1 relative overflow-hidden h-full'>
                        {/* Electric Wave Effect */}
                        <ElectricWave variant="white" position="bottom" opacity={0.25} />
                        {/* Logo */}
                        <div className='w-20 h-16 md:w-24 md:h-20 mb-3 bg-white rounded-lg flex items-center justify-center group-hover:bg-primary-green/10 transition-colors shadow-sm p-2'>
                          <div className='relative w-full h-full'>
                            <Image
                              src={recruiter.logo_url}
                              alt={`${recruiter.name} logo`}
                              width={100}
                              height={60}
                              className='object-contain transition-all duration-300 group-hover:scale-110'
                            />
                          </div>
                        </div>
                        {/* Company Name */}
                        <p className='text-sm font-semibold text-gray-800 mb-1 group-hover:text-primary-green transition-colors'>
                          {recruiter.name}
                        </p>
                        {/* Industry */}
                        {recruiter.industry && (
                          <div className='bg-primary-green/10 px-3 py-1 rounded-full'>
                            <p className='text-xs text-primary-green font-bold'>
                              {recruiter.industry}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        )}

      </div>
    </section>
  );
}
