'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { applyBlockStyles } from './BlockRenderer'
import type { CTABlockConfig } from '@/types/page-builder'
import Link from 'next/link'

interface CTABlockProps {
  block: CTABlockConfig
  isEditing?: boolean
}

export function CTABlock({ block, isEditing }: CTABlockProps) {
  const { config, styles } = block

  return (
    <section
      className="py-16 px-4 text-center bg-muted/50 rounded-lg my-8"
      style={applyBlockStyles(styles)}
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-4">{config.heading}</h2>
      {config.description && (
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          {config.description}
        </p>
      )}
      <div className="flex flex-wrap gap-4 justify-center">
        {config.buttons.map((button, index) => (
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
    </section>
  )
}
