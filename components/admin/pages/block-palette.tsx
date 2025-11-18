'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Heading,
  Type,
  Image as ImageIcon,
  Video,
  Layout,
  Grid,
  List,
  Table,
  BarChart,
  Calendar,
  Mail,
  Code,
  Quote,
  Columns,
  Layers,
  Package,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface BlockPaletteProps {
  onAddBlock: (blockType: string) => void
}

interface BlockCategory {
  name: string
  blocks: BlockDefinition[]
}

interface BlockDefinition {
  type: string
  label: string
  icon: React.ReactNode
  description: string
}

const blockCategories: BlockCategory[] = [
  {
    name: 'Content',
    blocks: [
      {
        type: 'hero',
        label: 'Hero',
        icon: <Package className="h-5 w-5" />,
        description: 'Large hero section with background',
      },
      {
        type: 'heading',
        label: 'Heading',
        icon: <Heading className="h-5 w-5" />,
        description: 'Text heading (H1-H6)',
      },
      {
        type: 'paragraph',
        label: 'Paragraph',
        icon: <Type className="h-5 w-5" />,
        description: 'Simple text paragraph',
      },
      {
        type: 'rich_text',
        label: 'Rich Text',
        icon: <Type className="h-5 w-5" />,
        description: 'Formatted text with HTML',
      },
      {
        type: 'quote',
        label: 'Quote',
        icon: <Quote className="h-5 w-5" />,
        description: 'Blockquote with attribution',
      },
      {
        type: 'cta',
        label: 'Call to Action',
        icon: <Package className="h-5 w-5" />,
        description: 'CTA section with buttons',
      },
    ],
  },
  {
    name: 'Media',
    blocks: [
      {
        type: 'image',
        label: 'Image',
        icon: <ImageIcon className="h-5 w-5" />,
        description: 'Single image with caption',
      },
      {
        type: 'gallery',
        label: 'Gallery',
        icon: <Grid className="h-5 w-5" />,
        description: 'Image gallery grid',
      },
      {
        type: 'video',
        label: 'Video',
        icon: <Video className="h-5 w-5" />,
        description: 'YouTube, Vimeo, or uploaded',
      },
      {
        type: 'carousel',
        label: 'Carousel',
        icon: <Layers className="h-5 w-5" />,
        description: 'Image carousel/slider',
      },
    ],
  },
  {
    name: 'Layout',
    blocks: [
      {
        type: 'two_column',
        label: 'Two Columns',
        icon: <Columns className="h-5 w-5" />,
        description: 'Two column layout',
      },
      {
        type: 'three_column',
        label: 'Three Columns',
        icon: <Columns className="h-5 w-5" />,
        description: 'Three column layout',
      },
      {
        type: 'card_grid',
        label: 'Card Grid',
        icon: <Grid className="h-5 w-5" />,
        description: 'Grid of cards',
      },
      {
        type: 'accordion',
        label: 'Accordion',
        icon: <List className="h-5 w-5" />,
        description: 'Collapsible sections',
      },
      {
        type: 'tabs',
        label: 'Tabs',
        icon: <Layout className="h-5 w-5" />,
        description: 'Tabbed content',
      },
    ],
  },
  {
    name: 'Data',
    blocks: [
      {
        type: 'table',
        label: 'Table',
        icon: <Table className="h-5 w-5" />,
        description: 'Data table',
      },
      {
        type: 'statistics',
        label: 'Statistics',
        icon: <BarChart className="h-5 w-5" />,
        description: 'Stats display',
      },
      {
        type: 'timeline',
        label: 'Timeline',
        icon: <Calendar className="h-5 w-5" />,
        description: 'Event timeline',
      },
      {
        type: 'contact_form',
        label: 'Contact Form',
        icon: <Mail className="h-5 w-5" />,
        description: 'Custom contact form',
      },
      {
        type: 'embed',
        label: 'Embed',
        icon: <Code className="h-5 w-5" />,
        description: 'Embed code (iframe/script)',
      },
    ],
  },
]

export function BlockPalette({ onAddBlock }: BlockPaletteProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCategories = blockCategories
    .map((category) => ({
      ...category,
      blocks: category.blocks.filter(
        (block) =>
          block.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          block.description.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.blocks.length > 0)

  return (
    <div className="w-80 border-r bg-card flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="font-semibold mb-3">Add Blocks</h2>
        <Input
          placeholder="Search blocks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-9"
        />
      </div>

      {/* Block Categories */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {filteredCategories.map((category) => (
            <div key={category.name}>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                {category.name}
              </h3>
              <div className="space-y-2">
                {category.blocks.map((block) => (
                  <Button
                    key={block.type}
                    variant="outline"
                    className={cn(
                      'w-full justify-start h-auto py-3 px-3',
                      'hover:bg-primary/10 hover:border-primary transition-colors'
                    )}
                    onClick={() => onAddBlock(block.type)}
                  >
                    <div className="flex items-start gap-3 w-full text-left">
                      <div className="mt-0.5 text-muted-foreground">
                        {block.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{block.label}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {block.description}
                        </div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
