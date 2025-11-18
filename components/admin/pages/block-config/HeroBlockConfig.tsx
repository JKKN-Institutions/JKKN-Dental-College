'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Trash } from 'lucide-react'
import type { HeroBlockConfig as HeroConfig } from '@/types/page-builder'
import { HexColorPicker } from 'react-colorful'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface HeroBlockConfigProps {
  config: HeroConfig['config']
  onUpdate: (config: HeroConfig['config']) => void
}

export function HeroBlockConfig({ config, onUpdate }: HeroBlockConfigProps) {
  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="space-y-2">
        <Label>Title</Label>
        <Input
          value={config.title}
          onChange={(e) => onUpdate({ ...config, title: e.target.value })}
          placeholder="Hero title"
        />
      </div>

      {/* Subtitle */}
      <div className="space-y-2">
        <Label>Subtitle (Optional)</Label>
        <Textarea
          value={config.subtitle || ''}
          onChange={(e) => onUpdate({ ...config, subtitle: e.target.value })}
          placeholder="Hero subtitle"
          rows={2}
        />
      </div>

      {/* Background Type */}
      <div className="space-y-2">
        <Label>Background Type</Label>
        <Select
          value={config.backgroundType}
          onValueChange={(value) => onUpdate({ ...config, backgroundType: value as any })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gradient">Gradient</SelectItem>
            <SelectItem value="image">Image</SelectItem>
            <SelectItem value="video">Video</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Background Configuration */}
      {config.backgroundType === 'gradient' && config.gradient && (
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>Gradient Start Color</Label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-12 h-10 p-0"
                    style={{ backgroundColor: config.gradient.start }}
                  />
                </PopoverTrigger>
                <PopoverContent className="w-auto p-3">
                  <HexColorPicker
                    color={config.gradient.start}
                    onChange={(color) =>
                      onUpdate({
                        ...config,
                        gradient: { ...config.gradient!, start: color },
                      })
                    }
                  />
                </PopoverContent>
              </Popover>
              <Input
                value={config.gradient.start}
                onChange={(e) =>
                  onUpdate({
                    ...config,
                    gradient: { ...config.gradient!, start: e.target.value },
                  })
                }
                placeholder="#0b6d41"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Gradient End Color</Label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-12 h-10 p-0"
                    style={{ backgroundColor: config.gradient.end }}
                  />
                </PopoverTrigger>
                <PopoverContent className="w-auto p-3">
                  <HexColorPicker
                    color={config.gradient.end}
                    onChange={(color) =>
                      onUpdate({
                        ...config,
                        gradient: { ...config.gradient!, end: color },
                      })
                    }
                  />
                </PopoverContent>
              </Popover>
              <Input
                value={config.gradient.end}
                onChange={(e) =>
                  onUpdate({
                    ...config,
                    gradient: { ...config.gradient!, end: e.target.value },
                  })
                }
                placeholder="#1a5f4a"
              />
            </div>
          </div>
        </div>
      )}

      {config.backgroundType === 'image' && (
        <div className="space-y-2">
          <Label>Background Image URL</Label>
          <Input
            value={config.backgroundImage || ''}
            onChange={(e) => onUpdate({ ...config, backgroundImage: e.target.value })}
            placeholder="https://example.com/image.jpg"
          />
        </div>
      )}

      {config.backgroundType === 'video' && (
        <div className="space-y-2">
          <Label>Background Video URL</Label>
          <Input
            value={config.backgroundVideo || ''}
            onChange={(e) => onUpdate({ ...config, backgroundVideo: e.target.value })}
            placeholder="https://example.com/video.mp4"
          />
        </div>
      )}

      {/* Overlay */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Dark Overlay</Label>
          <Switch
            checked={config.overlay || false}
            onCheckedChange={(checked) => onUpdate({ ...config, overlay: checked })}
          />
        </div>

        {config.overlay && (
          <div className="space-y-2">
            <Label>Overlay Opacity (%)</Label>
            <Input
              type="number"
              min="0"
              max="100"
              value={config.overlayOpacity || 50}
              onChange={(e) =>
                onUpdate({ ...config, overlayOpacity: parseInt(e.target.value) })
              }
            />
          </div>
        )}
      </div>

      {/* CTA Buttons */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>CTA Buttons</Label>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              onUpdate({
                ...config,
                ctaButtons: [
                  ...(config.ctaButtons || []),
                  { label: 'Button', href: '#', variant: 'primary' },
                ],
              })
            }
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Button
          </Button>
        </div>

        {config.ctaButtons?.map((button, index) => (
          <div key={index} className="border rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Button {index + 1}</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  onUpdate({
                    ...config,
                    ctaButtons: config.ctaButtons?.filter((_, i) => i !== index),
                  })
                }
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Input
              value={button.label}
              onChange={(e) => {
                const updated = [...(config.ctaButtons || [])]
                updated[index] = { ...button, label: e.target.value }
                onUpdate({ ...config, ctaButtons: updated })
              }}
              placeholder="Button label"
            />
            <Input
              value={button.href}
              onChange={(e) => {
                const updated = [...(config.ctaButtons || [])]
                updated[index] = { ...button, href: e.target.value }
                onUpdate({ ...config, ctaButtons: updated })
              }}
              placeholder="Button link"
            />
            <Select
              value={button.variant}
              onValueChange={(value) => {
                const updated = [...(config.ctaButtons || [])]
                updated[index] = { ...button, variant: value as any }
                onUpdate({ ...config, ctaButtons: updated })
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
