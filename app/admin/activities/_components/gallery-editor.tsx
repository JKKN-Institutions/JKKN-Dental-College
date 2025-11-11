/**
 * Gallery Editor Component
 * Multi-image upload with captions and alt text
 */

'use client'

import { useState, useRef } from 'react'
import { Plus, Trash2, Loader2, Image as ImageIcon, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import { uploadImage, deleteFile } from '@/lib/services/storage-service'

interface GalleryImage {
  id?: string
  image_url: string
  caption?: string | null
  alt_text?: string | null
  display_order: number
}

interface GalleryEditorProps {
  value: GalleryImage[]
  onChange: (images: GalleryImage[]) => void
}

export function GalleryEditor({ value, onChange }: GalleryEditorProps) {
  const [images, setImages] = useState<GalleryImage[]>(
    value.length > 0 ? value : []
  )
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const addImage = async (file: File) => {
    try {
      setUploadingIndex(images.length)

      // Upload image
      const url = await uploadImage(file, 'activity-images', 'gallery')

      const newImage: GalleryImage = {
        image_url: url,
        caption: '',
        alt_text: '',
        display_order: images.length,
      }

      const updated = [...images, newImage]
      setImages(updated)
      onChange(updated)
      toast.success('Image uploaded successfully')
    } catch (error) {
      console.error('[GalleryEditor] Upload error:', error)
      toast.error('Failed to upload image')
    } finally {
      setUploadingIndex(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Validate file types
    const invalidFiles = files.filter((file) => !file.type.startsWith('image/'))
    if (invalidFiles.length > 0) {
      toast.error('All files must be images')
      return
    }

    // Validate file sizes (max 5MB each)
    const oversizedFiles = files.filter((file) => file.size > 5 * 1024 * 1024)
    if (oversizedFiles.length > 0) {
      toast.error('Each image must be less than 5MB')
      return
    }

    // Upload files sequentially
    for (const file of files) {
      await addImage(file)
    }
  }

  const updateImage = (index: number, field: keyof GalleryImage, value: string) => {
    const updated = [...images]
    updated[index] = { ...updated[index], [field]: value || null }
    setImages(updated)
    onChange(updated)
  }

  const removeImage = async (index: number) => {
    const image = images[index]

    try {
      // Delete from storage
      await deleteFile(image.image_url, 'activity-images')

      // Remove from list
      const updated = images.filter((_, i) => i !== index)

      // Reorder remaining images
      const reordered = updated.map((img, i) => ({
        ...img,
        display_order: i,
      }))

      setImages(reordered)
      onChange(reordered)
      toast.success('Image removed')
    } catch (error) {
      console.error('[GalleryEditor] Remove error:', error)
      toast.error('Failed to remove image')
    }
  }

  const moveImage = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === images.length - 1)
    ) {
      return
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1
    const updated = [...images]
    const temp = updated[index]
    updated[index] = updated[newIndex]
    updated[newIndex] = temp

    // Update display orders
    const reordered = updated.map((img, i) => ({
      ...img,
      display_order: i,
    }))

    setImages(reordered)
    onChange(reordered)
  }

  return (
    <div className="space-y-4">
      {images.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">No gallery images added yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {images.map((image, index) => (
            <Card key={index} className="p-4">
              <div className="flex gap-4">
                <div className="flex flex-col gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => moveImage(index, 'up')}
                    disabled={index === 0}
                  >
                    <GripVertical className="h-4 w-4" />
                  </Button>
                </div>

                <div className="w-32 h-32 bg-muted rounded overflow-hidden flex-shrink-0">
                  <img
                    src={image.image_url}
                    alt={image.alt_text || 'Gallery image'}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 space-y-3">
                  <div className="space-y-2">
                    <Label>Caption</Label>
                    <Input
                      placeholder="Brief description of the image"
                      value={image.caption || ''}
                      onChange={(e) =>
                        updateImage(index, 'caption', e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Alt Text</Label>
                    <Input
                      placeholder="Alternative text for accessibility"
                      value={image.alt_text || ''}
                      onChange={(e) =>
                        updateImage(index, 'alt_text', e.target.value)
                      }
                      maxLength={255}
                    />
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive flex-shrink-0"
                  onClick={() => removeImage(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileSelect}
          disabled={uploadingIndex !== null}
        />

        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadingIndex !== null}
          className="w-full"
        >
          {uploadingIndex !== null ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Add Gallery Images
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
