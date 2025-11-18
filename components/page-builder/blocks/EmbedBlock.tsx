'use client'

import React from 'react'
import { applyBlockStyles } from './BlockRenderer'
import type { EmbedBlockConfig } from '@/types/page-builder'
import { cn } from '@/lib/utils'

interface EmbedBlockProps {
  block: EmbedBlockConfig
  isEditing?: boolean
}

export function EmbedBlock({ block, isEditing }: EmbedBlockProps) {
  const { config, styles } = block

  const aspectRatioClasses = {
    '16/9': 'aspect-video',
    '4/3': 'aspect-[4/3]',
    '1/1': 'aspect-square',
  }

  if (config.embedType === 'script') {
    return (
      <div
        className="my-8"
        style={applyBlockStyles(styles)}
        dangerouslySetInnerHTML={{ __html: config.embedCode }}
      />
    )
  }

  return (
    <div
      className={cn(
        'my-8',
        config.aspectRatio && aspectRatioClasses[config.aspectRatio]
      )}
      style={applyBlockStyles(styles)}
    >
      <div
        className="w-full h-full"
        dangerouslySetInnerHTML={{ __html: config.embedCode }}
      />
    </div>
  )
}
