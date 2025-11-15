"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from 'next/image';
import { HiRefresh, HiVideoCamera, HiPlay } from 'react-icons/hi';
import SectionHeader from './ui/SectionHeader';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from './ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import ElectricWave from './ui/ElectricWave';
import { getActiveCampusVideos, type CampusVideo } from '@/app/admin/content/sections/[id]/edit/_actions/campus-videos-actions';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Helper function to extract YouTube video ID
function getYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([^?]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
}

// Helper function to check if URL is a YouTube video
function isYouTubeUrl(url: string): boolean {
  return url.includes('youtube.com') || url.includes('youtu.be');
}

export default function CampusVideos() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [campusVideos, setCampusVideos] = useState<CampusVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<CampusVideo | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const handleVideoClick = (video: CampusVideo) => {
    setSelectedVideo(video);
    setIsDialogOpen(true);
  };

  const renderVideoPlayer = (video: CampusVideo) => {
    if (isYouTubeUrl(video.video_url)) {
      const videoId = getYouTubeVideoId(video.video_url);
      if (videoId) {
        return (
          <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        );
      }
    }

    // For direct video files
    return (
      <video
        className="w-full aspect-video rounded-lg bg-black"
        controls
        autoPlay
        src={video.video_url}
      >
        Your browser does not support the video tag.
      </video>
    );
  };

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
                    <div
                      className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-white cursor-pointer h-full"
                      onClick={() => handleVideoClick(item)}
                    >
                      {/* Electric Wave Effect */}
                      <ElectricWave variant="green" position="bottom" opacity={0.3} />

                      {/* Video Thumbnail */}
                      <div className="aspect-video bg-gray-200 relative overflow-hidden">
                        <Image
                          src={item.thumbnail_url || `https://img.youtube.com/vi/${getYouTubeVideoId(item.video_url)}/maxresdefault.jpg`}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />

                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-all duration-300">
                          <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl">
                            <HiPlay className="w-8 h-8 md:w-10 md:h-10 text-primary-green ml-1" />
                          </div>
                        </div>

                        {/* Category Badge */}
                        {item.category && (
                          <div className="absolute top-4 left-4 bg-primary-green text-white px-3 py-1 rounded-full text-xs font-semibold">
                            {item.category}
                          </div>
                        )}
                      </div>

                      {/* Video Info */}
                      <div className="bg-white p-6">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-green transition-colors duration-300 mb-2">
                          {item.title}
                        </h3>
                        {item.description && (
                          <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
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

      {/* Video Player Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl w-[95vw] sm:w-[90vw] p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
          <DialogHeader className="p-4 sm:p-6 pb-0 sticky top-0 bg-white z-10">
            <DialogTitle className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 pr-10">
              {selectedVideo?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="p-4 sm:p-6 pt-4">
            {selectedVideo && renderVideoPlayer(selectedVideo)}
            {selectedVideo?.description && (
              <p className="mt-4 text-gray-600 text-sm leading-relaxed">{selectedVideo.description}</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
