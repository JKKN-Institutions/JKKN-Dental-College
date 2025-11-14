'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { HiRefresh, HiPhotograph } from 'react-icons/hi';
import SectionHeader from './ui/SectionHeader';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from './ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import ElectricWave from './ui/ElectricWave';
import { getActiveLifeAtJKKN, type LifeAtJKKN } from '@/app/admin/content/sections/[id]/edit/_actions/life-at-jkkn-actions';

export default function LifeAtJKKN() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [lifeAspects, setLifeAspects] = useState<LifeAtJKKN[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const autoplayPlugin = useRef(
    Autoplay({ delay: 3500, stopOnInteraction: false })
  );

  useEffect(() => {
    async function loadLifeAtJKKN() {
      setIsLoading(true);
      const result = await getActiveLifeAtJKKN();
      if (result.success && result.data) {
        setLifeAspects(result.data);
      }
      setIsLoading(false);
    }
    loadLifeAtJKKN();
  }, []);

  return (
    <section
      id='life-at-jkkn'
      ref={ref}
      className='py-8 sm:py-12 md:py-16 bg-white relative overflow-hidden'
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

        {/* Loading State */}
        {isLoading ? (
          <div className='flex justify-center items-center py-12'>
            <HiRefresh className='w-8 h-8 text-primary-green animate-spin' />
            <span className='ml-3 text-gray-600'>Loading campus life...</span>
          </div>
        ) : lifeAspects.length === 0 ? (
          /* Empty State */
          <div className='text-center py-12'>
            <HiPhotograph className='w-12 h-12 text-gray-400 mx-auto mb-4' />
            <p className='text-gray-500'>No campus life photos available at the moment.</p>
          </div>
        ) : (
          /* Campus Life Carousel */
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            plugins={[autoplayPlugin.current]}
            className='mb-12'
          >
            <CarouselContent className="-ml-4">
              {lifeAspects.map((aspect, index) => (
                <CarouselItem key={aspect.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className='group h-full'
                  >
                    <div className='relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white cursor-pointer h-full flex flex-col'>
                      {/* Electric Wave Effect */}
                      <ElectricWave variant="yellow" position="bottom" opacity={0.35} />
                      {/* Image */}
                      <div className='relative h-72 overflow-hidden flex-shrink-0'>
                        <Image
                          src={aspect.image_url}
                          alt={aspect.title}
                          fill
                          className='object-cover group-hover:scale-110 transition-transform duration-500'
                          sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
                        />
                        {/* Gradient overlay - darkens on hover */}
                        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:from-black/90 group-hover:via-black/40 transition-all duration-300'></div>

                        {/* Title Overlay */}
                        <div className='absolute bottom-0 left-0 right-0 p-6'>
                          <h3 className='text-2xl md:text-3xl font-bold text-white drop-shadow-lg group-hover:text-primary-cream group-hover:scale-105 transition-all duration-300 origin-left'>
                            {aspect.title}
                          </h3>
                        </div>
                      </div>

                      {/* Description */}
                      {aspect.description && (
                        <div className='p-6 bg-white flex-1'>
                          <p className='text-gray-600 leading-relaxed group-hover:text-gray-900 transition-colors duration-300'>
                            {aspect.description}
                          </p>
                        </div>
                      )}
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
