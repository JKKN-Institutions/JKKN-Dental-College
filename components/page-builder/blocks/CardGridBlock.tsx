'use client'

import React from 'react'
import Image from 'next/image'
import { applyBlockStyles } from './BlockRenderer'
import type { CardGridBlockConfig } from '@/types/page-builder'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface CardGridBlockProps {
  block: CardGridBlockConfig
  isEditing?: boolean
}

export function CardGridBlock({ block, isEditing }: CardGridBlockProps) {
  const { config, styles } = block

  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  const cardStyles = {
    flat: 'border-0 shadow-none bg-muted/50',
    elevated: 'shadow-lg hover:shadow-xl transition-shadow',
    outlined: 'border-2',
  }

  return (
    <div
      className={cn('grid gap-6 my-8', gridCols[config.columns])}
      style={applyBlockStyles(styles)}
    >
      {config.cards.map((card, index) => {
        const cardContent = (
          <Card className={cn(cardStyles[config.cardStyle || 'elevated'], card.link && 'cursor-pointer hover:border-primary transition')}>
            {card.image && (
              <div className="relative w-full aspect-video rounded-t-lg overflow-hidden">
                <Image src={card.image} alt={card.title} fill className="object-cover" />
              </div>
            )}
            <CardHeader>
              {card.icon && <div className="text-4xl mb-2">{card.icon}</div>}
              <CardTitle>{card.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">{card.description}</CardDescription>
            </CardContent>
          </Card>
        )

        if (card.link) {
          return (
            <Link key={index} href={card.link}>
              {cardContent}
            </Link>
          )
        }

        return <div key={index}>{cardContent}</div>
      })}
    </div>
  )
}
