'use client'

import React from 'react'
import Image from 'next/image'
import { applyBlockStyles } from './BlockRenderer'
import type { CarouselBlockConfig } from '@/types/page-builder'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import Link from 'next/link'

interface CarouselBlockProps {
  block: CarouselBlockConfig
  isEditing?: boolean
}

export function CarouselBlock({ block, isEditing }: CarouselBlockProps) {
  const { config, styles } = block

  const plugins = []
  if (config.autoplay) {
    plugins.push(
      Autoplay({
        delay: config.interval || 3000,
        stopOnInteraction: true,
      })
    )
  }

  return (
    <div className="my-8" style={applyBlockStyles(styles)}>
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        plugins={plugins}
        className="w-full"
      >
        <CarouselContent>
          {config.slides.map((slide, index) => (
            <CarouselItem key={index}>
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <Image
                  src={slide.image}
                  alt={slide.title || `Slide ${index + 1}`}
                  fill
                  className="object-cover"
                />
                {(slide.title || slide.description) && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                    <div className="text-white">
                      {slide.title && <h3 className="text-2xl font-bold mb-2">{slide.title}</h3>}
                      {slide.description && <p className="text-lg">{slide.description}</p>}
                      {slide.link && (
                        <Link
                          href={slide.link}
                          className="mt-4 inline-block px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition"
                        >
                          Learn More
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {config.showArrows !== false && (
          <>
            <CarouselPrevious />
            <CarouselNext />
          </>
        )}
      </Carousel>
    </div>
  )
}
