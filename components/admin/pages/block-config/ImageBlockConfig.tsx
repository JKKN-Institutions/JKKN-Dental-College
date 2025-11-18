'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ImageBlockConfig as ImageConfig } from '@/types/page-builder'

interface ImageBlockConfigProps {
  config: ImageConfig['config']
  onUpdate: (config: ImageConfig['config']) => void
}

export function ImageBlockConfig({ config, onUpdate }: ImageBlockConfigProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Image URL</Label>
        <Input
          value={config.src}
          onChange={(e) => onUpdate({ ...config, src: e.target.value })}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="space-y-2">
        <Label>Alt Text</Label>
        <Input
          value={config.alt}
          onChange={(e) => onUpdate({ ...config, alt: e.target.value })}
          placeholder="Image description for accessibility"
        />
      </div>

      <div className="space-y-2">
        <Label>Caption (Optional)</Label>
        <Textarea
          value={config.caption || ''}
          onChange={(e) => onUpdate({ ...config, caption: e.target.value })}
          placeholder="Image caption"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label>Aspect Ratio</Label>
        <Select
          value={config.aspectRatio || 'auto'}
          onValueChange={(value) => onUpdate({ ...config, aspectRatio: value as any })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="16/9">16:9 (Widescreen)</SelectItem>
            <SelectItem value="4/3">4:3 (Standard)</SelectItem>
            <SelectItem value="1/1">1:1 (Square)</SelectItem>
            <SelectItem value="auto">Auto</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Object Fit</Label>
        <Select
          value={config.objectFit || 'cover'}
          onValueChange={(value) => onUpdate({ ...config, objectFit: value as any })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cover">Cover</SelectItem>
            <SelectItem value="contain">Contain</SelectItem>
            <SelectItem value="fill">Fill</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
