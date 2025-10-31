'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { HiCalendar } from 'react-icons/hi';
import SectionHeader from './ui/SectionHeader';
import SpotlightCard from './ui/SpotlightCard';
import Carousel from './ui/Carousel';

const pastEvents = [
  {
    id: 1,
    image: 'event-1.jpg',
    title: 'Annual Cultural Festival - Utsav 2024',
    description: '3-day cultural extravaganza featuring dance, music, drama, and various competitions with participation from 50+ colleges.',
    date: 'December 10-12, 2024',
    location: 'JKKN Main Campus',
    participants: '2000+ Students',
    category: 'Cultural'
  },
  {
    id: 2,
    image: 'event-2.jpg',
    title: 'National Level Technical Symposium',
    description: 'Technical symposium featuring paper presentations, project exhibitions, and workshops on emerging technologies.',
    date: 'November 25, 2024',
    location: 'Auditorium',
    participants: '500+ Participants',
    category: 'Technical'
  },
  {
    id: 3,
    image: 'event-3.jpg',
    title: 'Sports Meet 2024',
    description: 'Inter-department sports competition featuring cricket, football, basketball, athletics, and indoor games.',
    date: 'November 15-17, 2024',
    location: 'Sports Complex',
    participants: '1000+ Athletes',
    category: 'Sports'
  },
  {
    id: 4,
    image: 'event-4.jpg',
    title: 'Industry-Academia Conclave',
    description: 'Panel discussions and networking sessions with industry experts on bridging the gap between academia and industry.',
    date: 'October 28, 2024',
    location: 'Conference Hall',
    participants: '200+ Professionals',
    category: 'Industry'
  },
  {
    id: 5,
    image: 'event-5.jpg',
    title: 'Hackathon 2024 - Code Warriors',
    description: '24-hour coding marathon where students developed innovative solutions to real-world problems.',
    date: 'October 12-13, 2024',
    location: 'Innovation Lab',
    participants: '150+ Coders',
    category: 'Competition'
  },
  {
    id: 6,
    image: 'event-6.jpg',
    title: 'Alumni Meet 2024',
    description: 'Reunion of alumni from various batches sharing experiences and strengthening the JKKN family bond.',
    date: 'September 30, 2024',
    location: 'JKKN Campus',
    participants: '500+ Alumni',
    category: 'Alumni'
  }
];

export default function PastEvents() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id='events'
      ref={ref}
      className='py-20 bg-primary-cream/50 relative overflow-hidden'
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

        {/* Events Carousel with Spotlight Cards */}
        <Carousel
          autoPlay={true}
          autoPlayInterval={3500}
          showArrows={true}
          showDots={true}
          itemsPerView={{ mobile: 1, tablet: 2, desktop: 3 }}
          gap={32}
          className='mb-12 px-12'
        >
          {pastEvents.map((event, index) => (
            <SpotlightCard
              key={event.id}
              delay={index * 0.1}
              isInView={isInView}
              className="h-full"
            >
              {/* Image */}
              <div className='relative h-64 bg-gray-200 rounded-xl overflow-hidden mb-4'>
                <div className='w-full h-full flex items-center justify-center text-gray-400 transform group-hover:scale-110 transition-transform duration-300'>
                  <span className='text-sm'>Image: {event.image}</span>
                </div>
              </div>

              {/* Content */}
              <h3 className='text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-green transition-colors'>
                {event.title}
              </h3>

              {/* Event Date */}
              <div className='flex items-center gap-2 text-sm text-gray-600'>
                <HiCalendar className='text-primary-green' />
                <span>{event.date}</span>
              </div>
            </SpotlightCard>
          ))}
        </Carousel>
      </div>
    </section>
  );
}
