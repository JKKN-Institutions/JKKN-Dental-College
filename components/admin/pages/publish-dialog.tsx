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
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, CheckCircle2 } from 'lucide-react'
import type { Page, PublishPageDto } from '@/types/page-builder'
import { PageService } from '@/lib/services/page-builder/page-service'
import { toast } from 'sonner'

interface PublishDialogProps {
  page: Page
  onPublish: () => void
  onClose: () => void
}

export function PublishDialog({ page, onPublish, onClose }: PublishDialogProps) {
  const [isPublishing, setIsPublishing] = useState(false)
  const [addToNav, setAddToNav] = useState(false)
  const [navLabel, setNavLabel] = useState(page.title)
  const [navPosition, setNavPosition] = useState<'first' | 'last'>('last')

  const handlePublish = async () => {
    setIsPublishing(true)

    try {
      const publishData: PublishPageDto = {
        id: page.id,
        user_id: 'current-user-id', // TODO: Get actual user ID
        add_to_navigation: addToNav,
      }

      if (addToNav) {
        publishData.navigation_config = {
          label: navLabel,
          position: navPosition,
        }
      }

      await PageService.publishPage(publishData)

      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>Page published successfully!</span>
        </div>
      )

      onPublish()
    } catch (error) {
      toast.error('Failed to publish page')
      console.error(error)
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Publish Page</DialogTitle>
          <DialogDescription>
            Make this page publicly accessible at /{page.slug}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Preview Info */}
          <div className="rounded-lg border p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Page URL:</span>
              <code className="text-sm text-primary">/{page.slug}</code>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status:</span>
              <span className="text-sm">{page.status}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Blocks:</span>
              <span className="text-sm">{(page.blocks as any[]).length}</span>
            </div>
          </div>

          {/* Add to Navigation */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="add-to-nav">Add to Navigation Menu</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically add this page to the main navigation
                </p>
              </div>
              <Switch
                id="add-to-nav"
                checked={addToNav}
                onCheckedChange={setAddToNav}
              />
            </div>

            {addToNav && (
              <div className="space-y-4 pl-4 border-l-2">
                <div className="space-y-2">
                  <Label>Menu Label</Label>
                  <Input
                    value={navLabel}
                    onChange={(e) => setNavLabel(e.target.value)}
                    placeholder="How it appears in navigation"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Position</Label>
                  <Select value={navPosition} onValueChange={(value: any) => setNavPosition(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="first">First (beginning)</SelectItem>
                      <SelectItem value="last">Last (end)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          {/* Warning for changes */}
          {page.status === 'published' && (
            <div className="rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-3">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                This will update the published version with your current draft changes.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPublishing}>
            Cancel
          </Button>
          <Button onClick={handlePublish} disabled={isPublishing}>
            {isPublishing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {page.status === 'published' ? 'Update Published Page' : 'Publish Page'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
