"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from 'next/image';
import { HiRefresh, HiVideoCamera } from 'react-icons/hi';
import SectionHeader from './ui/SectionHeader';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from './ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import ElectricWave from './ui/ElectricWave';
import { getActiveCampusVideos, type CampusVideo } from '@/app/admin/content/sections/[id]/edit/_actions/campus-videos-actions';

export default function CampusVideos() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [campusVideos, setCampusVideos] = useState<CampusVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const autoplayPlugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false })
  );

  useEffect(() => {
    async function loadCampusVideos() {
      setIsLoading(true);
      const result = await getActiveCampusVideos();
      if (result.success && result.data) {
        setCampusVideos(result.data);
      }
      setIsLoading(false);
    }
    loadCampusVideos();
  }, []);

  return (
    <section id="campus-videos" ref={ref} className="py-8 sm:py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title='Campus'
          highlight='Videos'
          subtitle='Experience JKKN Institution through our campus video tours'
        />

        {/* Loading State */}
        {isLoading ? (
          <div className='flex justify-center items-center py-12'>
            <HiRefresh className='w-8 h-8 text-primary-green animate-spin' />
            <span className='ml-3 text-gray-600'>Loading campus videos...</span>
          </div>
        ) : campusVideos.length === 0 ? (
          /* Empty State */
          <div className='text-center py-12'>
            <HiVideoCamera className='w-12 h-12 text-gray-400 mx-auto mb-4' />
            <p className='text-gray-500'>No campus videos available at the moment.</p>
          </div>
        ) : (
          /* Campus Videos Carousel */
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            plugins={[autoplayPlugin.current]}
            className='mb-12'
          >
            <CarouselContent className="-ml-4">
              {campusVideos.map((item, index) => (
                <CarouselItem key={item.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group h-full"
                  >
                    <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-white cursor-pointer h-full">
                      {/* Electric Wave Effect */}
                      <ElectricWave variant="green" position="bottom" opacity={0.3} />
                      {/* Video */}
                      <div className="aspect-video bg-gray-200 relative overflow-hidden">
                        <Image
                          src={item.thumbnail_url || item.video_url}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      {/* Video Info */}
                      <div className="bg-white p-6">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-green transition-colors duration-300 mb-2">
                          {item.title}
                        </h3>
                        {item.description && (
                          <p className="text-gray-600 text-sm">{item.description}</p>
                        )}
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
