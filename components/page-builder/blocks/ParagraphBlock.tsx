'use client'

import React from 'react'
import { applyBlockStyles } from './BlockRenderer'
import type { ParagraphBlockConfig } from '@/types/page-builder'
import { cn } from '@/lib/utils'

interface ParagraphBlockProps {
  block: ParagraphBlockConfig
  isEditing?: boolean
}

export function ParagraphBlock({ block, isEditing }: ParagraphBlockProps) {
  const { config, styles } = block

  const sizeClasses = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  }

  return (
    <p
      className={cn('my-4', sizeClasses[config.fontSize || 'base'])}
      style={applyBlockStyles(styles)}
    >
      {config.content}
    </p>
  )
}
