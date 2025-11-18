'use client'

import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ParagraphBlockConfig as ParagraphConfig } from '@/types/page-builder'

interface ParagraphBlockConfigProps {
  config: ParagraphConfig['config']
  onUpdate: (config: ParagraphConfig['config']) => void
}

export function ParagraphBlockConfig({ config, onUpdate }: ParagraphBlockConfigProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Content</Label>
        <Textarea
          value={config.content}
          onChange={(e) => onUpdate({ ...config, content: e.target.value })}
          placeholder="Enter paragraph text"
          rows={6}
        />
      </div>

      <div className="space-y-2">
        <Label>Font Size</Label>
        <Select
          value={config.fontSize || 'base'}
          onValueChange={(value) => onUpdate({ ...config, fontSize: value as any })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sm">Small</SelectItem>
            <SelectItem value="base">Base</SelectItem>
            <SelectItem value="lg">Large</SelectItem>
            <SelectItem value="xl">Extra Large</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
