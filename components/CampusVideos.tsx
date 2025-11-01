"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import Image from 'next/image';
import { HiPlay, HiX } from "react-icons/hi";
import SectionHeader from './ui/SectionHeader';
import Carousel from './ui/Carousel';
import ElectricWave from './ui/ElectricWave';

const videos = [
  {
    id: 1,
    title: "Campus Tour",
    thumbnail: "/images/jkkn institution.jpeg",
    videoUrl: "/videos/campus-video.mp4",
    description: "Take a virtual tour of our beautiful JKKN campus and facilities",
  },
  {
    id: 2,
    title: "JKKN Pathfinder 2024",
    thumbnail: "/images/achievement image.jpeg",
    videoUrl: "/videos/JKKN Pathfinder 2024_ Career Guidance To 12th Students.mp4",
    description: "Career guidance program for 12th standard students - shaping future careers",
  },
  {
    id: 3,
    title: "Vollymania Sports Day 2023",
    thumbnail: "/images/marathon image.jpeg",
    videoUrl: "/videos/Vollymania Sports Day 2023 Part 2 - JKKN Institutions.mp4",
    description: "Highlights from our exciting Vollymania Sports Day 2023 event",
  }
];

export default function CampusVideos() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [selectedVideo, setSelectedVideo] = useState<typeof videos[0] | null>(
    null
  );

  return (
    <section id="campus-videos" ref={ref} className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title='Campus'
          highlight='Videos'
          subtitle='Experience JKKN Institution through immersive campus videos'
        />

        {/* Videos Carousel */}
        <Carousel
          autoPlay={true}
          autoPlayInterval={4000}
          showArrows={true}
          showDots={true}
          itemsPerView={{ mobile: 1, tablet: 2, desktop: 3 }}
          gap={32}
          className='mb-12 px-12'
        >
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group cursor-pointer"
              onClick={() => setSelectedVideo(video)}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white">
                {/* Electric Wave Effect */}
                <ElectricWave variant="green" position="bottom" opacity={0.3} />
                {/* Thumbnail */}
                <div className="aspect-video bg-gray-200 relative overflow-hidden">
                  {/* Actual Thumbnail Image */}
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-black/30"></div>

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/40 transition-colors duration-300">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                      <HiPlay className="text-4xl text-primary-green ml-1" />
                    </div>
                  </div>

                  {/* Video duration badge (optional) */}
                  <div className="absolute bottom-4 right-4 bg-black/80 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    🎥 Video
                  </div>
                </div>
                {/* Video Info */}
                <div className="bg-white p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {video.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{video.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </Carousel>

        {/* Video Modal */}
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedVideo(null)}
          >
            <div className="relative w-full max-w-5xl">
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              >
                <HiX className="text-4xl" />
              </button>
              <div
                className="bg-black rounded-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <video
                  controls
                  autoPlay
                  className="w-full aspect-video"
                  src={selectedVideo.videoUrl}
                >
                  Your browser does not support the video tag.
                </video>
                <div className="p-6 bg-gray-900">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {selectedVideo.title}
                  </h3>
                  <p className="text-gray-300">{selectedVideo.description}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
