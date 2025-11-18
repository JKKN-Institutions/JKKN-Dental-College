'use client'

import React from 'react'
import { applyBlockStyles } from './BlockRenderer'
import type { AccordionBlockConfig } from '@/types/page-builder'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

interface AccordionBlockProps {
  block: AccordionBlockConfig
  isEditing?: boolean
}

export function AccordionBlock({ block, isEditing }: AccordionBlockProps) {
  const { config, styles } = block

  return (
    <div className="my-8" style={applyBlockStyles(styles)}>
      <Accordion type={config.allowMultiple ? 'multiple' : 'single'} collapsible>
        {config.items.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left">{item.title}</AccordionTrigger>
            <AccordionContent>
              <div className="prose max-w-none">{item.content}</div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
