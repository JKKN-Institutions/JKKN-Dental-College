'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { X } from 'lucide-react'
import type { PageBlock } from '@/types/page-builder'
import { StylePanel } from './StylePanel'
import { HeroBlockConfig } from './HeroBlockConfig'
import { HeadingBlockConfig } from './HeadingBlockConfig'
import { ParagraphBlockConfig } from './ParagraphBlockConfig'
import { ImageBlockConfig } from './ImageBlockConfig'
import { CTABlockConfig } from './CTABlockConfig'

interface BlockConfigPanelProps {
  block: PageBlock
  onUpdate: (block: PageBlock) => void
  onClose: () => void
}

export function BlockConfigPanel({
  block,
  onUpdate,
  onClose,
}: BlockConfigPanelProps) {
  const [activeTab, setActiveTab] = useState('content')

  const handleConfigUpdate = (config: any) => {
    console.log('BlockConfigPanel: Config update called')
    console.log('BlockConfigPanel: Old block:', block)
    console.log('BlockConfigPanel: New config:', config)
    const updatedBlock = { ...block, config } as PageBlock
    console.log('BlockConfigPanel: Updated block:', updatedBlock)
    onUpdate(updatedBlock)
  }

  const handleStyleUpdate = (styles: PageBlock['styles']) => {
    onUpdate({ ...block, styles } as PageBlock)
  }

  return (
    <div className="w-96 border-l bg-card flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h2 className="font-semibold">Block Settings</h2>
          <p className="text-sm text-muted-foreground capitalize">
            {block.type.replace(/_/g, ' ')}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="px-4 pt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="style">Style</TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1 p-4">
          {/* Content Tab */}
          <TabsContent value="content" className="mt-0 space-y-4">
            {renderBlockConfig(block, handleConfigUpdate)}
          </TabsContent>

          {/* Style Tab */}
          <TabsContent value="style" className="mt-0">
            <StylePanel
              styles={block.styles}
              onUpdate={handleStyleUpdate}
            />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  )
}

function renderBlockConfig(
  block: PageBlock,
  onUpdate: (config: any) => void
) {
  switch (block.type) {
    case 'hero':
      return <HeroBlockConfig config={block.config as any} onUpdate={onUpdate} />
    case 'heading':
      return <HeadingBlockConfig config={block.config as any} onUpdate={onUpdate} />
    case 'paragraph':
      return <ParagraphBlockConfig config={block.config as any} onUpdate={onUpdate} />
    case 'image':
      return <ImageBlockConfig config={block.config as any} onUpdate={onUpdate} />
    case 'cta':
      return <CTABlockConfig config={block.config as any} onUpdate={onUpdate} />
    // Add more cases for other block types
    default:
      return (
        <div className="text-sm text-muted-foreground">
          Configuration panel for {block.type} coming soon...
        </div>
      )
  }
}
