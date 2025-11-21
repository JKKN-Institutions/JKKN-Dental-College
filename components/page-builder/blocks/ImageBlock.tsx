'use client'

import React from 'react'
import Image from 'next/image'
import { applyBlockStyles } from './BlockRenderer'
import type { ImageBlockConfig } from '@/types/page-builder'

interface ImageBlockProps {
  block: ImageBlockConfig
  isEditing?: boolean
}

export function ImageBlock({ block, isEditing }: ImageBlockProps) {
  const { config, styles } = block

  const aspectRatioMap = {
    '16/9': 'aspect-video',
    '4/3': 'aspect-[4/3]',
    '1/1': 'aspect-square',
    'auto': '',
  }

  const maxWidthMap = {
    'sm': 'max-w-sm',      // 384px
    'md': 'max-w-md',      // 768px
    'lg': 'max-w-lg',      // 1024px
    'xl': 'max-w-xl',      // 1280px
    'full': 'max-w-full',  // Full width
  }

  const maxWidth = (config as any).maxWidth || 'full'

  return (
    <figure className="my-8 flex justify-center" style={applyBlockStyles(styles)}>
      <div className={`relative w-full ${maxWidthMap[maxWidth as keyof typeof maxWidthMap]} ${aspectRatioMap[config.aspectRatio || 'auto']}`}>
        <Image
          src={config.src}
          alt={config.alt}
          fill={config.aspectRatio !== 'auto'}
          width={config.aspectRatio === 'auto' ? 1200 : undefined}
          height={config.aspectRatio === 'auto' ? 800 : undefined}
          className={`rounded-lg ${config.objectFit ? `object-${config.objectFit}` : 'object-cover'}`}
        />
      </div>
      {config.caption && (
        <figcaption className="mt-2 text-center text-sm text-muted-foreground">
          {config.caption}
        </figcaption>
      )}
    </figure>
  )
}
