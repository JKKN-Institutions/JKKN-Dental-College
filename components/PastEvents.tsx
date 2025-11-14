'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { HiCalendar, HiRefresh } from 'react-icons/hi';
import SectionHeader from './ui/SectionHeader';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from './ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import ElectricWave from './ui/ElectricWave';
import { getActivePastEvents, type PastEvent } from '@/app/admin/content/sections/[id]/edit/_actions/past-events-actions';

export default function PastEvents() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [pastEvents, setPastEvents] = useState<PastEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const autoplayPlugin = useRef(
    Autoplay({ delay: 3500, stopOnInteraction: false })
  );

  useEffect(() => {
    async function loadPastEvents() {
      setIsLoading(true);
      const result = await getActivePastEvents();
      if (result.success && result.data) {
        setPastEvents(result.data);
      }
      setIsLoading(false);
    }
    loadPastEvents();
  }, []);

  return (
    <section
      id='events'
      ref={ref}
      className='py-8 sm:py-12 md:py-16 bg-primary-cream/50 relative overflow-hidden'
    >
      {/* Decorative Elements */}
      <div className='absolute top-1/4 right-0 w-96 h-96 bg-primary-green/5 rounded-full blur-3xl'></div>
      <div className='absolute bottom-1/4 left-0 w-96 h-96 bg-primary-green/5 rounded-full blur-3xl'></div>

      <div className='container mx-auto px-4 relative z-10'>
        <SectionHeader
          title='Past'
          highlight='Events'
          subtitle='Celebrating moments of excellence, creativity, and community spirit at JKKN'
        />

        {/* Loading State */}
        {isLoading ? (
          <div className='flex justify-center items-center py-12'>
            <HiRefresh className='w-8 h-8 text-primary-green animate-spin' />
            <span className='ml-3 text-gray-600'>Loading past events...</span>
          </div>
        ) : pastEvents.length === 0 ? (
          /* Empty State */
          <div className='text-center py-12'>
            <HiCalendar className='w-12 h-12 text-gray-400 mx-auto mb-4' />
            <p className='text-gray-500'>No past events available at the moment.</p>
          </div>
        ) : (
          /* Events Carousel with Spotlight Cards */
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            plugins={[autoplayPlugin.current]}
            className='mb-12'
          >
            <CarouselContent className="-ml-4">
              {pastEvents.map((event, index) => (
                <CarouselItem key={event.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className='h-full relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer'
                  >
                    {/* Electric Wave Effect */}
                    <ElectricWave variant="green" position="bottom" opacity={0.35} />

                    {/* Image */}
                    <div className='relative h-56 bg-gray-200 rounded-xl overflow-hidden mb-4'>
                      <Image
                        src={event.image_url}
                        alt={event.title}
                        fill
                        className='object-cover transition-transform duration-300 group-hover:scale-110'
                        sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
                      />
                    </div>

                    {/* Content */}
                    <h3 className='text-xl font-bold text-gray-900 group-hover:text-primary-green transition-colors duration-300 mb-3 line-clamp-2'>
                      {event.title}
                    </h3>

                    {/* Event Date */}
                    <div className='flex items-center gap-2 text-sm text-gray-600'>
                      <HiCalendar className='text-primary-green flex-shrink-0' />
                      <span className='line-clamp-1'>
                        {event.event_date ? new Date(event.event_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : 'Date TBA'}
                      </span>
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
