'use client'

import React from 'react'
import { BlockRenderer, applyBlockStyles } from './BlockRenderer'
import type { TabsBlockConfig } from '@/types/page-builder'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface TabsBlockProps {
  block: TabsBlockConfig
  isEditing?: boolean
}

export function TabsBlock({ block, isEditing }: TabsBlockProps) {
  const { config, styles } = block

  return (
    <div className="my-8" style={applyBlockStyles(styles)}>
      <Tabs defaultValue={`tab-${config.defaultTab || 0}`}>
        <TabsList>
          {config.tabs.map((tab, index) => (
            <TabsTrigger key={index} value={`tab-${index}`}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {config.tabs.map((tab, index) => (
          <TabsContent key={index} value={`tab-${index}`} className="space-y-4">
            {tab.content.map((childBlock) => (
              <BlockRenderer key={childBlock.id} block={childBlock} isEditing={isEditing} />
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
