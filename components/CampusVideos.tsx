"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { HiPlay, HiX } from "react-icons/hi";

const videos = [
  {
    id: 1,
    title: "Campus Tour",
    thumbnail: "/images/campus-tour.jpg",
    videoUrl: "/videos/campus-tour.mp4",
    description: "Take a virtual tour of our beautiful campus",
  },
  {
    id: 2,
    title: "Library & Labs",
    thumbnail: "/images/library.jpg",
    videoUrl: "/videos/library.mp4",
    description: "Explore our state-of-the-art facilities",
  },
  {
    id: 3,
    title: "Sports Facilities",
    thumbnail: "/images/sports.jpg",
    videoUrl: "/videos/sports.mp4",
    description: "Experience our world-class sports infrastructure",
  },
  {
    id: 4,
    title: "Student Life",
    thumbnail: "/images/student-life.jpg",
    videoUrl: "/videos/student-life.mp4",
    description: "A glimpse into vibrant student life at JKKN",
  },
  {
    id: 5,
    title: "Events & Activities",
    thumbnail: "/images/events.jpg",
    videoUrl: "/videos/events.mp4",
    description: "Cultural events and technical festivals",
  },
  {
    id: 6,
    title: "Hostel Facilities",
    thumbnail: "/images/hostel.jpg",
    videoUrl: "/videos/hostel.mp4",
    description: "Comfortable and safe hostel accommodation",
  },
];

export default function CampusVideos() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedVideo, setSelectedVideo] = useState<typeof videos[0] | null>(
    null
  );

  return (
    <section id="campus-videos" ref={ref} className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Campus <span className="text-primary-green">Videos</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Experience JKKN Institution through immersive campus videos
          </p>
        </motion.div>

        {/* Horizontal Scrolling Container */}
        <div className="relative">
          <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide">
            {videos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, x: 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex-shrink-0 w-80 md:w-96 snap-center group cursor-pointer"
                onClick={() => setSelectedVideo(video)}
              >
                <div className="relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  {/* Thumbnail */}
                  <div className="aspect-video bg-gray-200 relative">
                    {/* Placeholder - Replace with actual thumbnail */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-green/20 to-primary-green/40 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="text-6xl mb-2">🎥</div>
                        <p className="font-medium">{video.title}</p>
                      </div>
                    </div>
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                        <HiPlay className="text-4xl text-primary-green ml-1" />
                      </div>
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
          </div>
        </div>

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

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
