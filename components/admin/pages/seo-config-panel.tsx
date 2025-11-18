'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'
import type { Page } from '@/types/page-builder'

interface SEOConfigPanelProps {
  page: Page
  onUpdate: (seoData: Page['seo_metadata']) => void
  onClose: () => void
}

export function SEOConfigPanel({ page, onUpdate, onClose }: SEOConfigPanelProps) {
  const [seoData, setSeoData] = useState(page.seo_metadata || {})
  const [keywordInput, setKeywordInput] = useState('')

  const handleSave = () => {
    onUpdate(seoData)
    onClose()
  }

  const handleAddKeyword = () => {
    if (!keywordInput.trim()) return
    const keywords = seoData.keywords || []
    setSeoData({
      ...seoData,
      keywords: [...keywords, keywordInput.trim()],
    })
    setKeywordInput('')
  }

  const handleRemoveKeyword = (index: number) => {
    const keywords = seoData.keywords || []
    setSeoData({
      ...seoData,
      keywords: keywords.filter((_, i) => i !== index),
    })
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>SEO Settings</DialogTitle>
          <DialogDescription>
            Configure search engine optimization metadata for this page
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Meta Title */}
          <div className="space-y-2">
            <Label htmlFor="seo-title">Meta Title</Label>
            <Input
              id="seo-title"
              value={seoData.title || ''}
              onChange={(e) => setSeoData({ ...seoData, title: e.target.value })}
              placeholder={page.title}
              maxLength={60}
            />
            <p className="text-xs text-muted-foreground">
              {(seoData.title || '').length}/60 characters (recommended max 60)
            </p>
          </div>

          {/* Meta Description */}
          <div className="space-y-2">
            <Label htmlFor="seo-description">Meta Description</Label>
            <Textarea
              id="seo-description"
              value={seoData.description || ''}
              onChange={(e) => setSeoData({ ...seoData, description: e.target.value })}
              placeholder="A brief description of this page for search results"
              rows={3}
              maxLength={160}
            />
            <p className="text-xs text-muted-foreground">
              {(seoData.description || '').length}/160 characters (recommended max 160)
            </p>
          </div>

          {/* OG Image */}
          <div className="space-y-2">
            <Label htmlFor="og-image">Open Graph Image</Label>
            <Input
              id="og-image"
              value={seoData.og_image || ''}
              onChange={(e) => setSeoData({ ...seoData, og_image: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-muted-foreground">
              Image shown when page is shared on social media (recommended 1200x630px)
            </p>
          </div>

          {/* Keywords */}
          <div className="space-y-2">
            <Label htmlFor="keywords">Keywords</Label>
            <div className="flex gap-2">
              <Input
                id="keywords"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddKeyword()
                  }
                }}
                placeholder="Add keyword"
              />
              <Button type="button" onClick={handleAddKeyword}>
                Add
              </Button>
            </div>
            {seoData.keywords && seoData.keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {seoData.keywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary">
                    {keyword}
                    <button
                      type="button"
                      onClick={() => handleRemoveKeyword(index)}
                      className="ml-2 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save SEO Settings</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
