"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { HiClock } from "react-icons/hi";

interface NewsItem {
  id: number;
  image: string;
  category: string;
  title: string;
  description: string;
  date: string;
  featured?: boolean;
}

interface NewsLoopProps {
  newsItems: NewsItem[];
  speed?: number;
  direction?: "left" | "right";
}

export default function NewsLoop({
  newsItems,
  speed = 40,
  direction = "left"
}: NewsLoopProps) {
  // Duplicate news items for seamless loop
  const duplicatedNews = [...newsItems, ...newsItems, ...newsItems];

  return (
    <div className="relative w-full overflow-hidden py-8">
      {/* Gradient Overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10"></div>

      {/* News Loop Container */}
      <motion.div
        className="flex gap-8 items-stretch"
        animate={{
          x: direction === "left" ? [0, -100 / 3 + "%"] : [-100 / 3 + "%", 0],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {duplicatedNews.map((news, index) => (
          <div
            key={`${news.id}-${index}`}
            className="flex-shrink-0 w-80 group cursor-pointer"
          >
            <div className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
              {/* Image */}
              <div className="relative h-48 bg-gray-200 overflow-hidden">
                <Image
                  src={news.image}
                  alt={news.title}
                  fill
                  className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                  sizes="320px"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300"></div>
                {/* Category Badge */}
                <div className="absolute top-4 left-4 bg-primary-green text-white px-3 py-1 rounded-full text-sm font-medium z-10">
                  {news.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <HiClock />
                  <span>{news.date}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-green transition-colors line-clamp-2">
                  {news.title}
                </h3>
                <p className="text-gray-600 leading-relaxed line-clamp-3 flex-1">
                  {news.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
