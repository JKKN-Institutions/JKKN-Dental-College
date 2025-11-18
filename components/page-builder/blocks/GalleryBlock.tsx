'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { applyBlockStyles } from './BlockRenderer'
import type { GalleryBlockConfig } from '@/types/page-builder'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface GalleryBlockProps {
  block: GalleryBlockConfig
  isEditing?: boolean
}

export function GalleryBlock({ block, isEditing }: GalleryBlockProps) {
  const { config, styles } = block
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <>
      <div
        className={cn(
          'grid gap-4 my-8',
          gridCols[config.columns]
        )}
        style={{
          ...applyBlockStyles(styles),
          gap: config.gap ? `${config.gap}px` : undefined,
        }}
      >
        {config.images.map((image, index) => (
          <figure key={index} className="group cursor-pointer">
            <div
              className="relative aspect-square overflow-hidden rounded-lg"
              onClick={() => config.lightbox && setLightboxIndex(index)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>
            {image.caption && (
              <figcaption className="mt-2 text-sm text-muted-foreground">
                {image.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      {/* Lightbox */}
      {config.lightbox && lightboxIndex !== null && (
        <Dialog open={true} onOpenChange={() => setLightboxIndex(null)}>
          <DialogContent className="max-w-4xl">
            <div className="relative w-full h-[80vh]">
              <Image
                src={config.images[lightboxIndex].src}
                alt={config.images[lightboxIndex].alt}
                fill
                className="object-contain"
              />
            </div>
            {config.images[lightboxIndex].caption && (
              <p className="text-center text-sm text-muted-foreground mt-4">
                {config.images[lightboxIndex].caption}
              </p>
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
