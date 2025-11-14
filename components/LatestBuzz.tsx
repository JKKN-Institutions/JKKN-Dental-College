'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { HiTrendingUp, HiSparkles, HiUserGroup, HiAcademicCap, HiRefresh } from 'react-icons/hi';
import SectionHeader from './ui/SectionHeader';
import ElectricWave from './ui/ElectricWave';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from './ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { getActiveLatestBuzz, type LatestBuzz as LatestBuzzType } from '@/app/admin/content/sections/[id]/edit/_actions/latest-buzz-actions';

export default function LatestBuzz() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [buzzItems, setBuzzItems] = useState<LatestBuzzType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const autoplayPlugin = useRef(
    Autoplay({ delay: 3500, stopOnInteraction: false })
  );

  useEffect(() => {
    async function loadBuzzItems() {
      setIsLoading(true);
      const result = await getActiveLatestBuzz();
      if (result.success && result.data) {
        setBuzzItems(result.data);
      }
      setIsLoading(false);
    }
    loadBuzzItems();
  }, []);

  return (
    <section
      id='buzz'
      ref={ref}
      className='py-8 sm:py-12 md:py-16 bg-white relative overflow-hidden'
    >
      {/* Decorative Elements */}
      <div className='absolute top-1/4 right-0 w-96 h-96 bg-primary-green/5 rounded-full blur-3xl'></div>
      <div className='absolute bottom-1/4 left-0 w-96 h-96 bg-primary-green/5 rounded-full blur-3xl'></div>

      <div className='container mx-auto px-4 relative z-10'>
        <SectionHeader
          title='Latest'
          highlight='Buzz'
          subtitle="What's trending at JKKN - Stay connected with the most exciting updates and announcements"
        />

        {/* Loading State */}
        {isLoading ? (
          <div className='flex justify-center items-center py-12'>
            <HiRefresh className='w-8 h-8 text-primary-green animate-spin' />
            <span className='ml-3 text-gray-600'>Loading latest buzz...</span>
          </div>
        ) : buzzItems.length === 0 ? (
          /* Empty State */
          <div className='text-center py-12'>
            <HiSparkles className='w-12 h-12 text-gray-400 mx-auto mb-4' />
            <p className='text-gray-500'>No buzz items available at the moment.</p>
          </div>
        ) : (
          /* Buzz Cards Carousel */
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            plugins={[autoplayPlugin.current]}
            className='mb-12'
          >
            <CarouselContent className="-ml-4">
              {buzzItems.map((item, index) => (
                <CarouselItem key={item.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className='group h-full'
                  >
                    <div className='bg-white rounded-xl shadow-lg transition-all duration-300 overflow-hidden cursor-pointer h-full flex flex-col'>
                      {/* Image */}
                      <div className='relative h-56 bg-gradient-to-br from-primary-green/10 to-primary-green/5 overflow-hidden'>
                        <Image
                          src={item.image_url}
                          alt={item.title}
                          fill
                          className='object-cover transition-transform duration-300 group-hover:scale-110'
                          sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
                        />
                      </div>

                      {/* Content */}
                      <div className='p-4 text-center'>
                        <h3 className='text-lg font-bold text-gray-900 group-hover:text-primary-green transition-colors duration-300 leading-tight line-clamp-2'>
                          {item.title}
                        </h3>
                      </div>
                    </div>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}
      </div>
    </section>
  );
}
