'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Trash } from 'lucide-react'
import type { CTABlockConfig as CTAConfig } from '@/types/page-builder'

interface CTABlockConfigProps {
  config: CTAConfig['config']
  onUpdate: (config: CTAConfig['config']) => void
}

export function CTABlockConfig({ config, onUpdate }: CTABlockConfigProps) {
  return (
    <div className="space-y-4">
      {/* Heading */}
      <div className="space-y-2">
        <Label>Heading</Label>
        <Input
          value={config.heading}
          onChange={(e) => onUpdate({ ...config, heading: e.target.value })}
          placeholder="Call to action heading"
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label>Description (Optional)</Label>
        <Textarea
          value={config.description || ''}
          onChange={(e) => onUpdate({ ...config, description: e.target.value })}
          placeholder="Optional description text"
          rows={3}
        />
      </div>

      {/* Buttons */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Buttons</Label>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              onUpdate({
                ...config,
                buttons: [
                  ...config.buttons,
                  { label: 'Button', href: '#', variant: 'primary' },
                ],
              })
            }
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Button
          </Button>
        </div>

        {config.buttons.map((button, index) => (
          <div key={index} className="border rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Button {index + 1}</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  onUpdate({
                    ...config,
                    buttons: config.buttons.filter((_, i) => i !== index),
                  })
                }
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Input
              value={button.label}
              onChange={(e) => {
                const updated = [...config.buttons]
                updated[index] = { ...button, label: e.target.value }
                onUpdate({ ...config, buttons: updated })
              }}
              placeholder="Button label"
            />
            <Input
              value={button.href}
              onChange={(e) => {
                const updated = [...config.buttons]
                updated[index] = { ...button, href: e.target.value }
                onUpdate({ ...config, buttons: updated })
              }}
              placeholder="Button link"
            />
            <Select
              value={button.variant}
              onValueChange={(value) => {
                const updated = [...config.buttons]
                updated[index] = { ...button, variant: value as any }
                onUpdate({ ...config, buttons: updated })
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primary">Primary</SelectItem>
                <SelectItem value="secondary">Secondary</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
    </div>
  )
}
