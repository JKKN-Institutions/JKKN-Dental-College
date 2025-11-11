"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from 'next/image';
import SectionHeader from './ui/SectionHeader';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from './ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import ElectricWave from './ui/ElectricWave';

const campusVideos = [
  {
    id: 1,
    title: "State-of-the-Art Classrooms",
    image: "/images/classroom.jpeg",
    description: "Modern, technology-enabled learning spaces designed for interactive education",
  },
  {
    id: 2,
    title: "Sports & Recreation",
    image: "/images/sports.jpeg",
    description: "World-class sports facilities to nurture athletic excellence and fitness",
  },
  {
    id: 3,
    title: "Campus Facilities",
    image: "/images/facilities.jpeg",
    description: "Comprehensive facilities providing students with all essential amenities",
  },
  {
    id: 4,
    title: "Comfortable Hostel Accommodation",
    image: "/images/hostel.jpeg",
    description: "Safe and comfortable hostel facilities with modern amenities for students",
  },
  {
    id: 5,
    title: "Campus Infrastructure",
    image: "/images/college infrastructure.jpeg",
    description: "Sprawling campus with world-class infrastructure and green spaces",
  },
  {
    id: 6,
    title: "JKKN Institution",
    image: "/images/jkkn institution.jpeg",
    description: "The heart of JKKN - where knowledge meets innovation and excellence",
  }
];

export default function CampusVideos() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const autoplayPlugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false })
  );

  return (
    <section id="campus-videos" ref={ref} className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title='Campus'
          highlight='Videos'
          subtitle='Experience JKKN Institution through our campus video tours'
        />

        {/* Campus Videos Carousel */}
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
                        src={item.image}
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
                      <p className="text-gray-600 text-sm">{item.description}</p>
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
