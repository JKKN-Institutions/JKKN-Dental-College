'use client'

import React from 'react'
import { applyBlockStyles } from './BlockRenderer'
import type { TimelineBlockConfig } from '@/types/page-builder'
import { cn } from '@/lib/utils'

interface TimelineBlockProps {
  block: TimelineBlockConfig
  isEditing?: boolean
}

export function TimelineBlock({ block, isEditing }: TimelineBlockProps) {
  const { config, styles } = block

  if (config.orientation === 'horizontal') {
    return (
      <div className="my-8 overflow-x-auto" style={applyBlockStyles(styles)}>
        <div className="flex gap-8 min-w-max pb-4">
          {config.events.map((event, index) => (
            <div key={index} className="relative flex flex-col items-center w-64">
              <div className="w-4 h-4 rounded-full bg-primary mb-4" />
              {index < config.events.length - 1 && (
                <div className="absolute top-2 left-1/2 w-64 h-0.5 bg-primary/30" />
              )}
              <div className="text-sm font-semibold text-primary mb-2">{event.date}</div>
              <div className="text-center">
                <h4 className="font-bold mb-2">{event.title}</h4>
                <p className="text-sm text-muted-foreground">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="my-8 relative" style={applyBlockStyles(styles)}>
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary/30" />
      <div className="space-y-8 pl-16">
        {config.events.map((event, index) => (
          <div key={index} className="relative">
            <div className="absolute -left-[2.15rem] top-2 w-4 h-4 rounded-full bg-primary border-4 border-background" />
            <div className="text-sm font-semibold text-primary mb-2">{event.date}</div>
            <h4 className="font-bold mb-2">{event.title}</h4>
            <p className="text-muted-foreground">{event.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
