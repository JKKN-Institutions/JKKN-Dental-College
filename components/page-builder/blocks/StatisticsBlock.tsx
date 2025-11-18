'use client'

import React from 'react'
import { applyBlockStyles } from './BlockRenderer'
import type { StatisticsBlockConfig } from '@/types/page-builder'
import { cn } from '@/lib/utils'

interface StatisticsBlockProps {
  block: StatisticsBlockConfig
  isEditing?: boolean
}

export function StatisticsBlock({ block, isEditing }: StatisticsBlockProps) {
  const { config, styles } = block

  const layoutClasses = {
    horizontal: 'flex flex-wrap justify-around',
    grid: `grid grid-cols-1 md:grid-cols-${config.columns || 3} gap-6`,
  }

  return (
    <div
      className={cn('my-8 p-8 bg-muted/50 rounded-lg', layoutClasses[config.layout])}
      style={applyBlockStyles(styles)}
    >
      {config.stats.map((stat, index) => (
        <div key={index} className="text-center p-4">
          {stat.icon && <div className="text-4xl mb-2">{stat.icon}</div>}
          <div className="text-4xl font-bold text-primary mb-2">
            {stat.value}
            {stat.suffix && <span className="text-3xl">{stat.suffix}</span>}
          </div>
          <div className="text-lg text-muted-foreground">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}
