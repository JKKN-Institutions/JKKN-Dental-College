'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { HiClock } from 'react-icons/hi';
import SectionHeader from './ui/SectionHeader';
import { getActiveCollegeNews, type CollegeNews as CollegeNewsType } from '@/app/admin/content/sections/[id]/edit/_actions/college-news-actions';

export default function CollegeNews() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [isPaused, setIsPaused] = useState(false);
  const [newsItems, setNewsItems] = useState<CollegeNewsType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    setIsLoading(true);
    try {
      const result = await getActiveCollegeNews();
      if (result.success && result.data) {
        setNewsItems(result.data);
      } else {
        console.error('[CollegeNews] Error loading news:', result.error);
      }
    } catch (error) {
      console.error('[CollegeNews] Exception loading news:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTouchStart = () => {
    setIsPaused(true);
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
  };

  // If no news items, show a message
  if (!isLoading && newsItems.length === 0) {
    return (
      <section
        id='news'
        ref={ref}
        className='py-8 sm:py-12 md:py-16 bg-gradient-to-b from-white to-primary-cream/30 relative overflow-hidden'
      >
        <div className='container mx-auto px-4 relative z-10'>
          <SectionHeader
            title='College'
            highlight='News'
            subtitle='Stay updated with the latest happenings, achievements, and announcements from JKKN Institution'
          />
          <div className='text-center py-12 text-gray-500'>
            No news available at the moment. Check back soon!
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id='news'
      ref={ref}
      className='py-8 sm:py-12 md:py-16 bg-gradient-to-b from-white to-primary-cream/30 relative overflow-hidden'
    >
      {/* Decorative Elements */}
      <div className='absolute top-0 left-1/4 w-64 h-64 bg-primary-green/5 rounded-full blur-3xl'></div>

      <div className='container mx-auto px-4 relative z-10'>
        <SectionHeader
          title='College'
          highlight='News'
          subtitle='Stay updated with the latest happenings, achievements, and announcements from JKKN Institution'
        />

        {isLoading ? (
          <div className='text-center py-12 text-gray-500'>
            Loading news...
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className='relative'
          >
            <div className='overflow-hidden'>
              <motion.div
                animate={!isPaused ? { x: [0, -2000] } : {}}
                transition={
                  !isPaused
                    ? {
                        x: {
                          repeat: Infinity,
                          repeatType: 'loop',
                          duration: 30,
                          ease: 'linear'
                        }
                      }
                    : {}
                }
                onHoverStart={() => setIsPaused(true)}
                onHoverEnd={() => setIsPaused(false)}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                className='flex gap-4 sm:gap-6 pb-4'
              >
                {/* Duplicate items for seamless loop */}
                {[...newsItems, ...newsItems, ...newsItems].map((news, index) => (
                  <motion.div
                    key={`${news.id}-${index}`}
                    initial={{ opacity: 0, x: 50 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: (index % newsItems.length) * 0.1 }}
                    className='w-[85vw] min-w-[260px] max-w-[340px] sm:w-[320px] md:w-[340px] group flex-shrink-0'
                  >
                    <div className='bg-white rounded-2xl overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg'>
                      {/* Image */}
                      <div className='relative h-40 sm:h-48 md:h-56 bg-gradient-to-br from-primary-green/10 to-primary-green/5 overflow-hidden'>
                        <Image
                          src={news.image_url}
                          alt={news.title}
                          fill
                          className='object-cover transition-transform duration-300 group-hover:scale-110'
                          sizes='(max-width: 640px) 85vw, (max-width: 768px) 320px, 340px'
                          draggable={false}
                        />
                        {/* Date Badge */}
                        <div className='absolute top-3 left-3 sm:top-4 sm:left-4 z-10'>
                          <span className='bg-primary-green text-white px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2 shadow-lg'>
                            <HiClock className='text-xs sm:text-sm' />
                            {news.published_date
                              ? new Date(news.published_date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })
                              : 'Recent'}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className='p-3 sm:p-4 md:p-6 flex flex-col flex-1'>
                        <h3 className='text-base sm:text-lg md:text-xl font-bold text-primary-green leading-tight line-clamp-2 mb-2'>
                          {news.title}
                        </h3>
                        <p className='text-sm text-gray-600 line-clamp-3'>
                          {news.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
