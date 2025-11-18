'use client'

import React from 'react'
import { applyBlockStyles } from './BlockRenderer'
import type { HeadingBlockConfig } from '@/types/page-builder'

interface HeadingBlockProps {
  block: HeadingBlockConfig
  isEditing?: boolean
}

export function HeadingBlock({ block, isEditing }: HeadingBlockProps) {
  const { config, styles } = block
  const Tag = `h${config.level}` as keyof JSX.IntrinsicElements

  return (
    <Tag className="font-bold my-4" style={applyBlockStyles(styles)}>
      {config.text}
    </Tag>
  )
}
