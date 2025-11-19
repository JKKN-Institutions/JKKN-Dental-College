'use client'

import React from 'react'
import { applyBlockStyles } from './BlockRenderer'
import type { VideoBlockConfig } from '@/types/page-builder'

interface VideoBlockProps {
  block: VideoBlockConfig
  isEditing?: boolean
}

export function VideoBlock({ block, isEditing }: VideoBlockProps) {
  const { config, styles } = block

  const getEmbedUrl = (url: string, type: 'youtube' | 'vimeo') => {
    if (type === 'youtube') {
      const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1]
      return `https://www.youtube.com/embed/${videoId}?autoplay=${config.autoplay ? '1' : '0'}&loop=${config.loop ? '1' : '0'}`
    } else if (type === 'vimeo') {
      const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1]
      return `https://player.vimeo.com/video/${videoId}?autoplay=${config.autoplay ? '1' : '0'}&loop=${config.loop ? '1' : '0'}`
    }
    return url
  }

  return (
    <div className="my-8" style={applyBlockStyles(styles)}>
      <div className="relative w-full aspect-video rounded-lg overflow-hidden">
        {config.videoType === 'upload' && config.videoFile ? (
          <video
            src={config.videoFile}
            poster={config.thumbnail}
            controls={config.controls !== false}
            autoPlay={config.autoplay}
            loop={config.loop}
            className="w-full h-full object-cover"
          />
        ) : (
          config.videoUrl && config.videoType !== 'upload' && (
            <iframe
              src={getEmbedUrl(config.videoUrl, config.videoType)}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )
        )}
      </div>
    </div>
  )
}
