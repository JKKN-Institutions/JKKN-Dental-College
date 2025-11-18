'use client'

import React from 'react'
import { BlockRenderer, applyBlockStyles } from './BlockRenderer'
import type { ThreeColumnBlockConfig } from '@/types/page-builder'
import { cn } from '@/lib/utils'

interface ThreeColumnBlockProps {
  block: ThreeColumnBlockConfig
  isEditing?: boolean
}

export function ThreeColumnBlock({ block, isEditing }: ThreeColumnBlockProps) {
  const { config, styles } = block

  const alignmentClasses = {
    top: 'items-start',
    center: 'items-center',
    bottom: 'items-end',
  }

  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-3 gap-6 my-8',
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
        {config.centerColumn.map((childBlock) => (
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
