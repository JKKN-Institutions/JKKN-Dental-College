'use client';

import { motion, useMotionValue, useTransform, animate, PanInfo } from 'framer-motion';
import { useEffect, useRef, useState, ReactNode } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

interface CarouselProps {
  children: ReactNode[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  itemsPerView?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: number;
  className?: string;
}

export default function Carousel({
  children,
  autoPlay = false,
  autoPlayInterval = 5000,
  showArrows = true,
  showDots = true,
  itemsPerView = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 24,
  className = ''
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(itemsPerView.desktop || 3);
  const [isDragging, setIsDragging] = useState(false);
  const dragX = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const totalItems = children.length;
  const maxIndex = Math.max(0, totalItems - itemsToShow);

  // Handle responsive items per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsToShow(itemsPerView.mobile || 1);
      } else if (window.innerWidth < 1024) {
        setItemsToShow(itemsPerView.tablet || 2);
      } else {
        setItemsToShow(itemsPerView.desktop || 3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [itemsPerView]);

  // Auto play functionality
  useEffect(() => {
    if (autoPlay && !isDragging) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
      }, autoPlayInterval);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [autoPlay, autoPlayInterval, isDragging, maxIndex]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(Math.min(index, maxIndex));
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (Math.abs(velocity) > 500 || Math.abs(offset) > 100) {
      if (offset > 0 && currentIndex > 0) {
        handlePrevious();
      } else if (offset < 0 && currentIndex < maxIndex) {
        handleNext();
      }
    }

    animate(dragX, 0, { type: 'spring', stiffness: 300, damping: 30 });
  };

  const handleDragStart = () => {
    setIsDragging(true);
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  };

  // Calculate transform based on current index
  const itemWidth = containerRef.current
    ? (containerRef.current.offsetWidth + gap) / itemsToShow
    : 0;

  const translateX = useTransform(
    dragX,
    [0, 0],
    [-currentIndex * itemWidth, -currentIndex * itemWidth]
  );

  return (
    <div className={`relative ${className}`}>
      {/* Carousel Container */}
      <div className="overflow-hidden" ref={containerRef}>
        <motion.div
          className="flex"
          style={{
            x: translateX,
            gap: `${gap}px`
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          animate={{
            x: -currentIndex * itemWidth
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30
          }}
        >
          {children.map((child, index) => (
            <motion.div
              key={index}
              className="flex-shrink-0"
              style={{
                width: `calc((100% - ${gap * (itemsToShow - 1)}px) / ${itemsToShow})`
              }}
            >
              {child}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Navigation Arrows */}
      {showArrows && totalItems > itemsToShow && (
        <>
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 ${
              currentIndex === 0
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-primary-green hover:text-white'
            }`}
            aria-label="Previous slide"
          >
            <HiChevronLeft className="text-2xl" />
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 ${
              currentIndex >= maxIndex
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-primary-green hover:text-white'
            }`}
            aria-label="Next slide"
          >
            <HiChevronRight className="text-2xl" />
          </button>
        </>
      )}

      {/* Dots Navigation */}
      {showDots && totalItems > itemsToShow && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentIndex === index
                  ? 'bg-primary-green w-8'
                  : 'bg-gray-300 w-2 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
