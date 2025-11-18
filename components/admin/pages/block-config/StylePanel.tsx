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
import type { CustomStyles } from '@/types/page-builder'
import { HexColorPicker } from 'react-colorful'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'

interface StylePanelProps {
  styles?: CustomStyles
  onUpdate: (styles: CustomStyles) => void
}

export function StylePanel({ styles = {}, onUpdate }: StylePanelProps) {
  const handleChange = (key: keyof CustomStyles, value: string) => {
    onUpdate({ ...styles, [key]: value })
  }

  return (
    <div className="space-y-6">
      {/* Colors */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Colors</h3>

        <div className="space-y-2">
          <Label>Background Color</Label>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-12 h-10 p-0"
                  style={{ backgroundColor: styles.backgroundColor || '#ffffff' }}
                />
              </PopoverTrigger>
              <PopoverContent className="w-auto p-3">
                <HexColorPicker
                  color={styles.backgroundColor || '#ffffff'}
                  onChange={(color) => handleChange('backgroundColor', color)}
                />
              </PopoverContent>
            </Popover>
            <Input
              value={styles.backgroundColor || ''}
              onChange={(e) => handleChange('backgroundColor', e.target.value)}
              placeholder="#ffffff"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Text Color</Label>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-12 h-10 p-0"
                  style={{ backgroundColor: styles.textColor || '#000000' }}
                />
              </PopoverTrigger>
              <PopoverContent className="w-auto p-3">
                <HexColorPicker
                  color={styles.textColor || '#000000'}
                  onChange={(color) => handleChange('textColor', color)}
                />
              </PopoverContent>
            </Popover>
            <Input
              value={styles.textColor || ''}
              onChange={(e) => handleChange('textColor', e.target.value)}
              placeholder="#000000"
            />
          </div>
        </div>
      </div>

      {/* Spacing */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Spacing</h3>

        <div className="space-y-2">
          <Label>Padding</Label>
          <Input
            value={styles.padding || ''}
            onChange={(e) => handleChange('padding', e.target.value)}
            placeholder="e.g., 20px or 2rem"
          />
        </div>

        <div className="space-y-2">
          <Label>Margin</Label>
          <Input
            value={styles.margin || ''}
            onChange={(e) => handleChange('margin', e.target.value)}
            placeholder="e.g., 20px or 2rem"
          />
        </div>
      </div>

      {/* Typography */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Typography</h3>

        <div className="space-y-2">
          <Label>Font Family</Label>
          <Input
            value={styles.fontFamily || ''}
            onChange={(e) => handleChange('fontFamily', e.target.value)}
            placeholder="e.g., Arial, sans-serif"
          />
        </div>

        <div className="space-y-2">
          <Label>Font Size</Label>
          <Input
            value={styles.fontSize || ''}
            onChange={(e) => handleChange('fontSize', e.target.value)}
            placeholder="e.g., 16px or 1rem"
          />
        </div>

        <div className="space-y-2">
          <Label>Font Weight</Label>
          <Select
            value={styles.fontWeight || ''}
            onValueChange={(value) => handleChange('fontWeight', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select weight" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="300">Light (300)</SelectItem>
              <SelectItem value="400">Normal (400)</SelectItem>
              <SelectItem value="500">Medium (500)</SelectItem>
              <SelectItem value="600">Semibold (600)</SelectItem>
              <SelectItem value="700">Bold (700)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Text Align</Label>
          <Select
            value={styles.textAlign || ''}
            onValueChange={(value) => handleChange('textAlign', value as any)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select alignment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="right">Right</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Layout */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Layout</h3>

        <div className="space-y-2">
          <Label>Max Width</Label>
          <Input
            value={styles.maxWidth || ''}
            onChange={(e) => handleChange('maxWidth', e.target.value)}
            placeholder="e.g., 1200px or 100%"
          />
        </div>

        <div className="space-y-2">
          <Label>Border Radius</Label>
          <Input
            value={styles.borderRadius || ''}
            onChange={(e) => handleChange('borderRadius', e.target.value)}
            placeholder="e.g., 8px or 0.5rem"
          />
        </div>
      </div>
    </div>
  )
}
