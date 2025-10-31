'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useMemo, useEffect } from 'react';
import { HiSpeakerphone, HiTrendingUp, HiSparkles } from 'react-icons/hi';
import { HiBolt } from 'react-icons/hi2';
import SectionHeader from './ui/SectionHeader';

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
    icon: HiSpeakerphone,
    title: 'Admission 2025-26 Open!',
    description: 'Applications are now open for various undergraduate and postgraduate programs. Early bird benefits available!',
    color: 'from-blue-500 to-blue-600',
    highlight: true
  },
  {
    id: 2,
    icon: HiTrendingUp,
    title: 'Entrepreneurship Cell Launch',
    description: 'New E-Cell launched to support student startups with mentorship and funding opportunities.',
    color: 'from-purple-500 to-purple-600',
    highlight: false
  },
  {
    id: 3,
    icon: HiSparkles,
    title: 'Annual Techfest 2025',
    description: 'JKKN Techfest 2025 - 3 days of innovation, workshops, and competitions. Register now!',
    color: 'from-pink-500 to-pink-600',
    highlight: false
  },
  {
    id: 4,
    icon: HiBolt,
    title: 'Industry Expert Webinar Series',
    description: 'Monthly webinar series featuring industry leaders sharing insights on latest technologies and trends.',
    color: 'from-orange-500 to-orange-600',
    highlight: false
  }
];

export default function LatestBuzz() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
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
                  className='relative rounded-2xl p-8 overflow-hidden h-full'
                  style={{ minHeight: '300px' }}
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-90`}></div>

                  {/* Animated Circles */}
                  <motion.div
                    className='absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full'
                    animate={{
                      scale: hoveredIndex === index ? 1.2 : 1,
                      rotate: hoveredIndex === index ? 90 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  ></motion.div>
                  <motion.div
                    className='absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full'
                    animate={{
                      scale: hoveredIndex === index ? 1.2 : 1,
                      rotate: hoveredIndex === index ? -90 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  ></motion.div>

                  {/* Content */}
                  <div className='relative z-10'>
                    <div className='flex items-start gap-4'>
                      <motion.div
                        animate={{
                          rotate: hoveredIndex === index ? 360 : 0,
                          scale: hoveredIndex === index ? 1.1 : 1,
                        }}
                        transition={{ duration: 0.5 }}
                        className='w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0'
                      >
                        <item.icon className='text-3xl text-white' />
                      </motion.div>
                      <div className='flex-1'>
                        <h3 className='text-xl md:text-2xl font-bold text-white mb-3'>
                          {item.title}
                        </h3>
                        <p className='text-white/90 leading-relaxed'>
                          {item.description}
                        </p>
                        {item.highlight && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className='mt-6 bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow'
                          >
                            Learn More
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Pulse Effect for Highlighted Item */}
                  {item.highlight && (
                    <motion.div
                      className='absolute inset-0 border-4 border-white/30 rounded-2xl'
                      animate={{
                        scale: [1, 1.02, 1],
                        opacity: [0.5, 0.8, 0.5],
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
