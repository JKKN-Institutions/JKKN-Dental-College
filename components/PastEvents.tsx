'use client';

import { useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { HiCalendar, HiLocationMarker, HiUsers } from 'react-icons/hi';
import SectionHeader from './ui/SectionHeader';
import SpotlightCard from './ui/SpotlightCard';
import Carousel from './ui/Carousel';
import ElectricWave from './ui/ElectricWave';

const pastEvents = [
  {
    id: 1,
    image: '/images/pongal celebration.jpeg',
    title: 'Pongal Celebration 2024',
    description: 'Traditional Pongal festival celebrations with cultural programs, games, and authentic Tamil festivities. Students celebrated the harvest festival with great enthusiasm.',
    date: 'January 15, 2024',
    location: 'JKKN Main Campus',
    participants: '2000+ Students',
    category: 'Cultural'
  },
  {
    id: 2,
    image: '/images/onam celebration.jpeg',
    title: 'Onam Festival 2024',
    description: 'Vibrant Onam celebrations featuring traditional Pookalam designs, Onam Sadya feast, and Kerala cultural performances by students.',
    date: 'September 15, 2024',
    location: 'Cultural Hall',
    participants: '1500+ Participants',
    category: 'Cultural'
  },
  {
    id: 3,
    image: '/images/marathon image.jpeg',
    title: 'JKKN Marathon 2024',
    description: 'Annual marathon promoting health and fitness with participation from students, faculty, and community members in various categories.',
    date: 'November 15, 2024',
    location: 'JKKN Campus Track',
    participants: '1000+ Athletes',
    category: 'Sports'
  },
  {
    id: 4,
    image: '/images/alumni meet.jpeg',
    title: 'Alumni Meet 2024',
    description: 'Reunion of alumni from various batches sharing experiences, networking, and strengthening the JKKN family bond.',
    date: 'October 28, 2024',
    location: 'JKKN Auditorium',
    participants: '500+ Alumni',
    category: 'Alumni'
  },
  {
    id: 5,
    image: '/images/achievement image.jpeg',
    title: 'National Level Hackathon',
    description: 'JKKN students secured first place in the national hackathon, showcasing innovation and technical prowess with groundbreaking projects.',
    date: 'October 12-13, 2024',
    location: 'Innovation Lab',
    participants: '150+ Coders',
    category: 'Achievement'
  },
  {
    id: 6,
    image: '/images/placement image.jpeg',
    title: 'Campus Recruitment Drive 2024',
    description: 'Successful campus placement drive with top companies recruiting JKKN students for various positions with excellent packages.',
    date: 'September 20-25, 2024',
    location: 'Placement Cell',
    participants: '300+ Students',
    category: 'Placement'
  }
];

export default function PastEvents() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

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
              className="h-full relative"
            >
              {/* Electric Wave Effect */}
              <ElectricWave variant="green" position="bottom" opacity={0.35} />

              {/* Image */}
              <div className='relative h-56 bg-gray-200 rounded-xl overflow-hidden mb-4'>
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className='object-cover transform group-hover:scale-110 transition-transform duration-500'
                  sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
                />
                <div className='absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300'></div>
                {/* Category Badge */}
                <div className='absolute top-4 right-4 bg-primary-green text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg z-10'>
                  {event.category}
                </div>
              </div>

              {/* Content */}
              <h3 className='text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-green transition-colors line-clamp-2'>
                {event.title}
              </h3>

              <p className='text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed'>
                {event.description}
              </p>

              {/* Event Details */}
              <div className='space-y-2'>
                <div className='flex items-center gap-2 text-sm text-gray-600'>
                  <HiCalendar className='text-primary-green flex-shrink-0' />
                  <span className='line-clamp-1'>{event.date}</span>
                </div>
                <div className='flex items-center gap-2 text-sm text-gray-600'>
                  <HiLocationMarker className='text-primary-green flex-shrink-0' />
                  <span className='line-clamp-1'>{event.location}</span>
                </div>
                <div className='flex items-center gap-2 text-sm text-gray-600'>
                  <HiUsers className='text-primary-green flex-shrink-0' />
                  <span className='line-clamp-1'>{event.participants}</span>
                </div>
              </div>
            </SpotlightCard>
          ))}
        </Carousel>
      </div>
    </section>
  );
}
