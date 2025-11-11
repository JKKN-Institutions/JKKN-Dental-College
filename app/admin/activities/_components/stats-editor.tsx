/**
 * Stats Editor Component
 * Dynamic editor for impact statistics with icon support
 */

'use client'

import { useState } from 'react'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ImpactStat {
  id?: string
  label: string
  value: string
  icon?: string | null
  display_order: number
}

interface StatsEditorProps {
  value: ImpactStat[]
  onChange: (stats: ImpactStat[]) => void
}

// Common Lucide icon names for selection
const ICON_OPTIONS = [
  { value: 'none', label: 'No Icon' },
  { value: 'users', label: 'Users' },
  { value: 'heart', label: 'Heart' },
  { value: 'target', label: 'Target' },
  { value: 'trending-up', label: 'Trending Up' },
  { value: 'award', label: 'Award' },
  { value: 'check-circle', label: 'Check Circle' },
  { value: 'star', label: 'Star' },
  { value: 'calendar', label: 'Calendar' },
  { value: 'map-pin', label: 'Map Pin' },
  { value: 'clock', label: 'Clock' },
  { value: 'activity', label: 'Activity' },
  { value: 'zap', label: 'Zap' },
  { value: 'smile', label: 'Smile' },
  { value: 'tree-deciduous', label: 'Tree' },
  { value: 'leaf', label: 'Leaf' },
  { value: 'droplet', label: 'Droplet' },
  { value: 'sun', label: 'Sun' },
  { value: 'book', label: 'Book' },
  { value: 'graduation-cap', label: 'Graduation Cap' },
  { value: 'briefcase', label: 'Briefcase' },
]

export function StatsEditor({ value, onChange }: StatsEditorProps) {
  const [stats, setStats] = useState<ImpactStat[]>(
    value.length > 0 ? value : []
  )

  const addStat = () => {
    const newStat: ImpactStat = {
      label: '',
      value: '',
      icon: null,
      display_order: stats.length,
    }
    const updated = [...stats, newStat]
    setStats(updated)
    onChange(updated)
  }

  const updateStat = (index: number, field: keyof ImpactStat, value: string) => {
    const updated = [...stats]
    // Convert 'none' to null for icon field
    const processedValue = field === 'icon' && value === 'none' ? null : (value || null)
    updated[index] = { ...updated[index], [field]: processedValue }
    setStats(updated)
    onChange(updated)
  }

  const removeStat = (index: number) => {
    const updated = stats.filter((_, i) => i !== index)
    // Reorder remaining stats
    const reordered = updated.map((stat, i) => ({
      ...stat,
      display_order: i,
    }))
    setStats(reordered)
    onChange(reordered)
  }

  const moveStat = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === stats.length - 1)
    ) {
      return
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1
    const updated = [...stats]
    const temp = updated[index]
    updated[index] = updated[newIndex]
    updated[newIndex] = temp

    // Update display orders
    const reordered = updated.map((stat, i) => ({
      ...stat,
      display_order: i,
    }))

    setStats(reordered)
    onChange(reordered)
  }

  return (
    <div className="space-y-4">
      {stats.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">No impact statistics added yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {stats.map((stat, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex flex-col gap-1 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => moveStat(index, 'up')}
                    disabled={index === 0}
                  >
                    <GripVertical className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label>Label</Label>
                    <Input
                      placeholder="e.g., Students Benefited"
                      value={stat.label}
                      onChange={(e) =>
                        updateStat(index, 'label', e.target.value)
                      }
                      maxLength={100}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Value</Label>
                    <Input
                      placeholder="e.g., 10,000+"
                      value={stat.value}
                      onChange={(e) =>
                        updateStat(index, 'value', e.target.value)
                      }
                      maxLength={100}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Icon</Label>
                    <Select
                      value={stat.icon || 'none'}
                      onValueChange={(value) =>
                        updateStat(index, 'icon', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select icon" />
                      </SelectTrigger>
                      <SelectContent>
                        {ICON_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                  onClick={() => removeStat(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        onClick={addStat}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Impact Statistic
      </Button>
    </div>
  )
}
