'use client'

import React from 'react'
import { BlockRenderer, applyBlockStyles } from './BlockRenderer'
import type { TwoColumnBlockConfig } from '@/types/page-builder'
import { cn } from '@/lib/utils'

interface TwoColumnBlockProps {
  block: TwoColumnBlockConfig
  isEditing?: boolean
}

export function TwoColumnBlock({ block, isEditing }: TwoColumnBlockProps) {
  const { config, styles } = block

  const ratioClasses = {
    '50/50': 'grid-cols-1 lg:grid-cols-2',
    '60/40': 'grid-cols-1 lg:grid-cols-[60fr_40fr]',
    '40/60': 'grid-cols-1 lg:grid-cols-[40fr_60fr]',
    '70/30': 'grid-cols-1 lg:grid-cols-[70fr_30fr]',
    '30/70': 'grid-cols-1 lg:grid-cols-[30fr_70fr]',
  }

  const alignmentClasses = {
    top: 'items-start',
    center: 'items-center',
    bottom: 'items-end',
  }

  return (
    <div
      className={cn(
        'grid gap-6 my-8',
        ratioClasses[config.ratio || '50/50'],
        alignmentClasses[config.verticalAlign || 'top']
      )}
      style={{
        ...applyBlockStyles(styles),
        gap: config.gap ? `${config.gap}px` : undefined,
      }}
    >
      <div className="space-y-4">
        {config.leftColumn.map((childBlock) => (
          <BlockRenderer key={childBlock.id} block={childBlock} isEditing={isEditing} />
        ))}
      </div>
      <div className="space-y-4">
        {config.rightColumn.map((childBlock) => (
          <BlockRenderer key={childBlock.id} block={childBlock} isEditing={isEditing} />
        ))}
      </div>
    </div>
  )
}
