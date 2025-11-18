'use client'

import React from 'react'
import { applyBlockStyles } from './BlockRenderer'
import type { QuoteBlockConfig } from '@/types/page-builder'

interface QuoteBlockProps {
  block: QuoteBlockConfig
  isEditing?: boolean
}

export function QuoteBlock({ block, isEditing }: QuoteBlockProps) {
  const { config, styles } = block

  return (
    <blockquote
      className="border-l-4 border-primary pl-6 py-4 my-8 italic"
      style={applyBlockStyles(styles)}
    >
      <p className="text-lg md:text-xl">{config.quote}</p>
      {(config.author || config.role) && (
        <footer className="mt-4 text-sm not-italic">
          {config.author && <cite className="font-semibold">{config.author}</cite>}
          {config.role && <span className="text-muted-foreground ml-2">{config.role}</span>}
        </footer>
      )}
    </blockquote>
  )
}
