'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { HiRefresh, HiUserGroup } from 'react-icons/hi';
import SectionHeader from './ui/SectionHeader';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from './ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { getActiveAlumni, type Alumni } from '@/app/admin/content/sections/[id]/edit/_actions/alumni-actions';

export default function OurAlumni() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [alumniTestimonials, setAlumniTestimonials] = useState<Alumni[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const autoplayPlugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false })
  );

  useEffect(() => {
    async function loadAlumni() {
      setIsLoading(true);
      const result = await getActiveAlumni();
      if (result.success && result.data) {
        setAlumniTestimonials(result.data);
      }
      setIsLoading(false);
    }
    loadAlumni();
  }, []);

  return (
    <section
      id='alumni'
      ref={ref}
      className='py-8 sm:py-12 md:py-16 bg-gradient-to-b from-white to-primary-cream/30 relative overflow-hidden'
    >
      {/* Decorative Elements */}
      <div className='absolute top-0 right-1/4 w-96 h-96 bg-primary-green/5 rounded-full blur-3xl'></div>
      <div className='absolute bottom-0 left-1/4 w-96 h-96 bg-primary-green/5 rounded-full blur-3xl'></div>

      <div className='container mx-auto px-4 relative z-10'>
        <SectionHeader
          title='Our College'
          highlight='Alumni'
          subtitle='Proud stories of our graduates making their mark across the globe'
        />

        {/* Loading State */}
        {isLoading ? (
          <div className='flex justify-center items-center py-12'>
            <HiRefresh className='w-8 h-8 text-primary-green animate-spin' />
            <span className='ml-3 text-gray-600'>Loading alumni...</span>
          </div>
        ) : alumniTestimonials.length === 0 ? (
          /* Empty State */
          <div className='text-center py-12'>
            <HiUserGroup className='w-12 h-12 text-gray-400 mx-auto mb-4' />
            <p className='text-gray-500'>No alumni testimonials available at the moment.</p>
          </div>
        ) : (
          /* Alumni Posters Carousel */
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            plugins={[autoplayPlugin.current]}
            className=''
          >
            <CarouselContent className="-ml-4">
              {alumniTestimonials.map((alumni, index) => (
                <CarouselItem key={alumni.id} className="pl-4 md:basis-1/2 lg:basis-1/4">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className='bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group h-full'
                  >
                    {/* Poster/Image */}
                    <div className='relative h-96 bg-gradient-to-br from-primary-green/10 to-primary-green/5 overflow-hidden'>
                      {alumni.image_url ? (
                        <Image
                          src={alumni.image_url}
                          alt={alumni.name}
                          fill
                          className='object-cover transition-transform duration-500 group-hover:scale-110'
                          sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw'
                        />
                      ) : (
                        <div className='w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-green/20 to-primary-green/10'>
                          <HiUserGroup className='w-24 h-24 text-gray-300' />
                        </div>
                      )}
                      {/* Overlay with Alumni Info */}
                      <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500'>
                        <h4 className='text-xl font-bold mb-1'>{alumni.name}</h4>
                        <p className='text-sm font-semibold text-primary-cream mb-1'>
                          {alumni.current_position}
                        </p>
                        <p className='text-xs opacity-90'>{alumni.company}</p>
                        <p className='text-xs mt-2 opacity-75'>Batch of {alumni.batch}</p>
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
