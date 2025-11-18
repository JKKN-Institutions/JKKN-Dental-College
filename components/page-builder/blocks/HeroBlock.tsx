'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { applyBlockStyles } from './BlockRenderer'
import type { HeroBlockConfig } from '@/types/page-builder'
import Link from 'next/link'

interface HeroBlockProps {
  block: HeroBlockConfig
  isEditing?: boolean
}

export function HeroBlock({ block, isEditing }: HeroBlockProps) {
  const { config, styles } = block

  // Determine background style
  const backgroundStyle: React.CSSProperties = {}
  if (config.backgroundType === 'gradient' && config.gradient) {
    backgroundStyle.backgroundImage = `linear-gradient(135deg, ${config.gradient.start}, ${config.gradient.end})`
  } else if (config.backgroundType === 'image' && config.backgroundImage) {
    backgroundStyle.backgroundImage = `url(${config.backgroundImage})`
    backgroundStyle.backgroundSize = 'cover'
    backgroundStyle.backgroundPosition = 'center'
  }

  return (
    <section
      className="relative w-full min-h-[500px] flex items-center justify-center"
      style={{ ...backgroundStyle, ...applyBlockStyles(styles) }}
    >
      {/* Background video */}
      {config.backgroundType === 'video' && config.backgroundVideo && (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={config.backgroundVideo} type="video/mp4" />
        </video>
      )}

      {/* Overlay */}
      {config.overlay && (
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: (config.overlayOpacity || 50) / 100 }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
          {config.title}
        </h1>
        {config.subtitle && (
          <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto">
            {config.subtitle}
          </p>
        )}
        {config.ctaButtons && config.ctaButtons.length > 0 && (
          <div className="flex flex-wrap gap-4 justify-center">
            {config.ctaButtons.map((button, index) => (
              <Button
                key={index}
                variant={button.variant === 'primary' ? 'default' : 'outline'}
                size="lg"
                asChild
              >
                <Link href={button.href}>{button.label}</Link>
              </Button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
