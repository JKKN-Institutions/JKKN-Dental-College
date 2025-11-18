'use client'

import React from 'react'
import { applyBlockStyles } from './BlockRenderer'
import type { RichTextBlockConfig } from '@/types/page-builder'

interface RichTextBlockProps {
  block: RichTextBlockConfig
  isEditing?: boolean
}

export function RichTextBlock({ block, isEditing }: RichTextBlockProps) {
  const { config, styles } = block

  return (
    <div
      className="prose prose-lg max-w-none my-4"
      style={applyBlockStyles(styles)}
      dangerouslySetInnerHTML={{ __html: config.html }}
    />
  )
}
