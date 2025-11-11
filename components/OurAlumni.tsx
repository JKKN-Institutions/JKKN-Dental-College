'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import SectionHeader from './ui/SectionHeader';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from './ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

const alumniTestimonials = [
  {
    id: 1,
    name: 'Dr. Rajesh Kumar',
    batch: '2015',
    designation: 'Senior Software Engineer',
    company: 'Google, USA',
    image: 'alumni-1.jpg'
  },
  {
    id: 2,
    name: 'Priya Sharma',
    batch: '2017',
    designation: 'Data Scientist',
    company: 'Microsoft, India',
    image: 'alumni-2.jpg'
  },
  {
    id: 3,
    name: 'Arun Krishnan',
    batch: '2014',
    designation: 'Entrepreneur & CEO',
    company: 'TechVentures Pvt Ltd',
    image: 'alumni-3.jpg'
  },
  {
    id: 4,
    name: 'Meera Patel',
    batch: '2016',
    designation: 'Cloud Architect',
    company: 'Amazon Web Services',
    image: 'alumni-4.jpg'
  }
];

export default function OurAlumni() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const autoplayPlugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false })
  );

  return (
    <section
      id='alumni'
      ref={ref}
      className='py-20 bg-gradient-to-b from-white to-primary-cream/30 relative overflow-hidden'
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

        {/* Alumni Posters Carousel */}
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
                  <div className='relative h-96 bg-gradient-to-br from-primary-green to-primary-green/80'>
                    <div className='w-full h-full flex items-center justify-center text-white/30'>
                      <span className='text-sm'>Alumni Poster: {alumni.image}</span>
                    </div>
                    {/* Overlay with Alumni Info */}
                    <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500'>
                      <h4 className='text-xl font-bold mb-1'>{alumni.name}</h4>
                      <p className='text-sm font-semibold text-primary-cream mb-1'>
                        {alumni.designation}
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
      </div>
    </section>
  );
}
