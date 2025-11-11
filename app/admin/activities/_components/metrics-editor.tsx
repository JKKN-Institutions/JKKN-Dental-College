/**
 * Metrics Editor Component
 * Dynamic editor for activity metrics (key-value pairs)
 */

'use client'

import { useState } from 'react'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'

interface Metric {
  id?: string
  metric_key: string
  metric_value: string
  display_order: number
}

interface MetricsEditorProps {
  value: Metric[]
  onChange: (metrics: Metric[]) => void
}

export function MetricsEditor({ value, onChange }: MetricsEditorProps) {
  const [metrics, setMetrics] = useState<Metric[]>(
    value.length > 0 ? value : []
  )

  const addMetric = () => {
    const newMetric: Metric = {
      metric_key: '',
      metric_value: '',
      display_order: metrics.length,
    }
    const updated = [...metrics, newMetric]
    setMetrics(updated)
    onChange(updated)
  }

  const updateMetric = (index: number, field: keyof Metric, value: string) => {
    const updated = [...metrics]
    updated[index] = { ...updated[index], [field]: value }
    setMetrics(updated)
    onChange(updated)
  }

  const removeMetric = (index: number) => {
    const updated = metrics.filter((_, i) => i !== index)
    // Reorder remaining metrics
    const reordered = updated.map((metric, i) => ({
      ...metric,
      display_order: i,
    }))
    setMetrics(reordered)
    onChange(reordered)
  }

  const moveMetric = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === metrics.length - 1)
    ) {
      return
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1
    const updated = [...metrics]
    const temp = updated[index]
    updated[index] = updated[newIndex]
    updated[newIndex] = temp

    // Update display orders
    const reordered = updated.map((metric, i) => ({
      ...metric,
      display_order: i,
    }))

    setMetrics(reordered)
    onChange(reordered)
  }

  return (
    <div className="space-y-4">
      {metrics.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">No metrics added yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {metrics.map((metric, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex flex-col gap-1 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => moveMetric(index, 'up')}
                    disabled={index === 0}
                  >
                    <GripVertical className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Metric Key</Label>
                    <Input
                      placeholder="e.g., Trees Planted"
                      value={metric.metric_key}
                      onChange={(e) =>
                        updateMetric(index, 'metric_key', e.target.value)
                      }
                      maxLength={100}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Metric Value</Label>
                    <Input
                      placeholder="e.g., 5,000+"
                      value={metric.metric_value}
                      onChange={(e) =>
                        updateMetric(index, 'metric_value', e.target.value)
                      }
                      maxLength={100}
                    />
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                  onClick={() => removeMetric(index)}
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
        onClick={addMetric}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Metric
      </Button>
    </div>
  )
}
