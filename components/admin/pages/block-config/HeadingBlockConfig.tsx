'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { HeadingBlockConfig as HeadingConfig } from '@/types/page-builder'

interface HeadingBlockConfigProps {
  config: HeadingConfig['config']
  onUpdate: (config: HeadingConfig['config']) => void
}

export function HeadingBlockConfig({ config, onUpdate }: HeadingBlockConfigProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Text</Label>
        <Input
          value={config.text}
          onChange={(e) => onUpdate({ ...config, text: e.target.value })}
          placeholder="Enter heading text"
        />
      </div>

      <div className="space-y-2">
        <Label>Heading Level</Label>
        <Select
          value={config.level.toString()}
          onValueChange={(value) => onUpdate({ ...config, level: parseInt(value) as any })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">H1 - Largest</SelectItem>
            <SelectItem value="2">H2</SelectItem>
            <SelectItem value="3">H3</SelectItem>
            <SelectItem value="4">H4</SelectItem>
            <SelectItem value="5">H5</SelectItem>
            <SelectItem value="6">H6 - Smallest</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
