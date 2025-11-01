'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { HiSpeakerphone, HiTrendingUp, HiSparkles, HiUserGroup, HiAcademicCap } from 'react-icons/hi';
import { HiBolt } from 'react-icons/hi2';
import SectionHeader from './ui/SectionHeader';
import ElectricWave from './ui/ElectricWave';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

const buzzItems = [
  {
    id: 1,
    icon: HiAcademicCap,
    image: '/images/placement image.jpeg',
    title: 'Campus Recruitment Drive 2025',
    description: 'Top companies visiting JKKN for campus placements. Join us for exciting career opportunities and exclusive interviews!',
    color: 'from-blue-500 to-blue-600',
    highlight: true
  },
  {
    id: 2,
    icon: HiTrendingUp,
    image: '/images/marathon image.jpeg',
    title: 'JKKN Marathon 2025',
    description: 'Annual marathon promoting health and fitness. Join students, faculty, and community members in this exciting run!',
    color: 'from-green-500 to-green-600',
    highlight: false
  },
  {
    id: 3,
    icon: HiUserGroup,
    image: '/images/alumni meet.jpeg',
    title: 'Alumni Meet 2025',
    description: 'Reconnect with former classmates and celebrate JKKN legacy. Network, share experiences, and inspire current students!',
    color: 'from-purple-500 to-purple-600',
    highlight: false
  },
  {
    id: 4,
    icon: HiSparkles,
    image: '/images/pongal celebration.jpeg',
    title: 'Pongal Celebration',
    description: 'Traditional Pongal festival celebrations with cultural programs, games, and authentic Tamil festivities. Join the harvest celebration!',
    color: 'from-orange-500 to-orange-600',
    highlight: false
  },
  {
    id: 5,
    icon: HiSparkles,
    image: '/images/onam celebration.jpeg',
    title: 'Onam Celebration',
    description: 'Experience the vibrant Onam festival with traditional Pookalam, Onam Sadya, and Kerala cultural performances!',
    color: 'from-pink-500 to-pink-600',
    highlight: false
  }
];

export default function LatestBuzz() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Only render particles on client to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Generate consistent random positions using useMemo to avoid hydration mismatch
  const particles = useMemo(() =>
    [...Array(8)].map((_, i) => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 2,
    })),
    []
  );

  return (
    <section
      id='buzz'
      ref={ref}
      className='py-20 bg-white relative overflow-hidden'
    >
      {/* Animated Background - Reduced particles for performance */}
      {isMounted && (
        <div className='absolute inset-0 opacity-5'>
          <div className='absolute top-0 left-0 w-full h-full'>
            {particles.map((particle, i) => (
              <motion.div
                key={i}
                className='absolute w-2 h-2 bg-primary-green rounded-full'
                style={{
                  left: `${particle.left}%`,
                  top: `${particle.top}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: particle.duration,
                  repeat: Infinity,
                  delay: particle.delay,
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div className='container mx-auto px-4 relative z-10'>
        <SectionHeader
          title='Latest'
          highlight='Buzz'
          subtitle="What's trending at JKKN - Stay connected with the most exciting updates and announcements"
        />

        {/* Swiper Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className='buzz-swiper-container'
        >
          <Swiper
            modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
            effect='coverflow'
            grabCursor={true}
            centeredSlides={true}
            slidesPerView='auto'
            coverflowEffect={{
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            navigation={false}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: false,
            }}
            loop={true}
            speed={600}
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 1.5,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 2,
                spaceBetween: 40,
              },
            }}
            className='mySwiper py-12'
          >
            {buzzItems.map((item, index) => (
              <SwiperSlide key={item.id}>
                <motion.div
                  onHoverStart={() => setHoveredIndex(index)}
                  onHoverEnd={() => setHoveredIndex(null)}
                  className='relative rounded-2xl overflow-hidden h-full shadow-2xl'
                  style={{ minHeight: '450px' }}
                >
                  {/* Electric Wave Effect */}
                  <ElectricWave variant="yellow" position="top" opacity={0.3} />

                  {/* Background Image */}
                  <div className='absolute inset-0'>
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className='object-cover'
                      sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px'
                    />
                    {/* Subtle dark overlay only at bottom for text readability */}
                    <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent'></div>
                  </div>

                  {/* Content */}
                  <div className='relative z-10 p-6 h-full flex flex-col justify-end'>
                    {/* Icon Badge */}
                    <motion.div
                      animate={{
                        rotate: hoveredIndex === index ? 360 : 0,
                        scale: hoveredIndex === index ? 1.1 : 1,
                      }}
                      transition={{ duration: 0.5 }}
                      className='w-16 h-16 bg-primary-green backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 shadow-lg'
                    >
                      <item.icon className='text-3xl text-white' />
                    </motion.div>

                    {/* Title */}
                    <h3 className='text-2xl md:text-3xl font-bold text-white mb-3 drop-shadow-lg'>
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className='text-white/95 leading-relaxed mb-4 drop-shadow-md text-base'>
                      {item.description}
                    </p>

                    {/* Learn More Button */}
                    {item.highlight && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className='bg-primary-green text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-green/90 transition-all shadow-lg self-start'
                      >
                        Learn More →
                      </motion.button>
                    )}
                  </div>

                  {/* Hover Overlay */}
                  <motion.div
                    className='absolute inset-0 bg-primary-green/10'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  ></motion.div>

                  {/* Pulse Effect for Highlighted Item */}
                  {item.highlight && (
                    <motion.div
                      className='absolute inset-0 border-4 border-primary-green/40 rounded-2xl'
                      animate={{
                        scale: [1, 1.02, 1],
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    ></motion.div>
                  )}
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>

      {/* Custom Swiper Styles */}
      <style jsx global>{`
        .buzz-swiper-container .swiper-slide {
          width: 100%;
          max-width: 600px;
        }

        .buzz-swiper-container .swiper-button-next,
        .buzz-swiper-container .swiper-button-prev {
          color: #187041;
          background: white;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .buzz-swiper-container .swiper-button-next:hover,
        .buzz-swiper-container .swiper-button-prev:hover {
          background: #187041;
          color: white;
          box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
        }

        .buzz-swiper-container .swiper-button-next::after,
        .buzz-swiper-container .swiper-button-prev::after {
          font-size: 20px;
          font-weight: bold;
        }

        .buzz-swiper-container .swiper-pagination-bullet {
          background: #187041;
          opacity: 0.5;
          width: 10px;
          height: 10px;
        }

        .buzz-swiper-container .swiper-pagination-bullet-active {
          opacity: 1;
          width: 30px;
          border-radius: 5px;
        }

        .buzz-swiper-container .swiper-pagination {
          bottom: 0 !important;
        }
      `}</style>
    </section>
  );
}
