'use client'

/**
 * Block Renderer
 * Main component that renders blocks based on their type
 */

import React from 'react'
import type { PageBlock } from '@/types/page-builder'

// Import all block components
import { HeroBlock } from './HeroBlock'
import { HeadingBlock } from './HeadingBlock'
import { ParagraphBlock } from './ParagraphBlock'
import { RichTextBlock } from './RichTextBlock'
import { QuoteBlock } from './QuoteBlock'
import { CTABlock } from './CTABlock'
import { ImageBlock } from './ImageBlock'
import { GalleryBlock } from './GalleryBlock'
import { VideoBlock } from './VideoBlock'
import { CarouselBlock } from './CarouselBlock'
import { TwoColumnBlock } from './TwoColumnBlock'
import { ThreeColumnBlock } from './ThreeColumnBlock'
import { CardGridBlock } from './CardGridBlock'
import { AccordionBlock } from './AccordionBlock'
import { TabsBlock } from './TabsBlock'
import { TableBlock } from './TableBlock'
import { StatisticsBlock } from './StatisticsBlock'
import { TimelineBlock } from './TimelineBlock'
import { ContactFormBlock } from './ContactFormBlock'
import { EmbedBlock } from './EmbedBlock'

interface BlockRendererProps {
  block: PageBlock
  isEditing?: boolean
  onBlockUpdate?: (block: PageBlock) => void
  onBlockDelete?: (blockId: string) => void
}

export function BlockRenderer({
  block,
  isEditing = false,
  onBlockUpdate,
  onBlockDelete,
}: BlockRendererProps) {
  // Don't render if block is hidden
  if (block.visibility === 'hidden') {
    return null
  }

  // Render the appropriate component based on block type
  switch (block.type) {
    case 'hero':
      return <HeroBlock block={block} isEditing={isEditing} />
    case 'heading':
      return <HeadingBlock block={block} isEditing={isEditing} />
    case 'paragraph':
      return <ParagraphBlock block={block} isEditing={isEditing} />
    case 'rich_text':
      return <RichTextBlock block={block} isEditing={isEditing} />
    case 'quote':
      return <QuoteBlock block={block} isEditing={isEditing} />
    case 'cta':
      return <CTABlock block={block} isEditing={isEditing} />
    case 'image':
      return <ImageBlock block={block} isEditing={isEditing} />
    case 'gallery':
      return <GalleryBlock block={block} isEditing={isEditing} />
    case 'video':
      return <VideoBlock block={block} isEditing={isEditing} />
    case 'carousel':
      return <CarouselBlock block={block} isEditing={isEditing} />
    case 'two_column':
      return <TwoColumnBlock block={block} isEditing={isEditing} />
    case 'three_column':
      return <ThreeColumnBlock block={block} isEditing={isEditing} />
    case 'card_grid':
      return <CardGridBlock block={block} isEditing={isEditing} />
    case 'accordion':
      return <AccordionBlock block={block} isEditing={isEditing} />
    case 'tabs':
      return <TabsBlock block={block} isEditing={isEditing} />
    case 'table':
      return <TableBlock block={block} isEditing={isEditing} />
    case 'statistics':
      return <StatisticsBlock block={block} isEditing={isEditing} />
    case 'timeline':
      return <TimelineBlock block={block} isEditing={isEditing} />
    case 'contact_form':
      return <ContactFormBlock block={block} isEditing={isEditing} />
    case 'embed':
      return <EmbedBlock block={block} isEditing={isEditing} />
    default:
      return (
        <div className="p-4 border border-dashed border-red-500 rounded-lg">
          <p className="text-red-500">Unknown block type: {(block as PageBlock).type}</p>
        </div>
      )
  }
}

/**
 * Utility function to apply custom styles to a block
 */
export function applyBlockStyles(styles?: PageBlock['styles']): React.CSSProperties {
  if (!styles) return {}

  return {
    backgroundColor: styles.backgroundColor,
    color: styles.textColor,
    padding: styles.padding,
    margin: styles.margin,
    borderRadius: styles.borderRadius,
    fontFamily: styles.fontFamily,
    fontSize: styles.fontSize,
    fontWeight: styles.fontWeight,
    textAlign: styles.textAlign,
    maxWidth: styles.maxWidth,
  }
}
