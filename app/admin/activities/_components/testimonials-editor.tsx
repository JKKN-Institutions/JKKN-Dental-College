/**
 * Testimonials Editor Component
 * Dynamic editor for activity testimonials with avatar support
 */

'use client'

import { useState, useRef } from 'react'
import { Plus, Trash2, GripVertical, Upload, Loader2, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import { uploadImage, deleteFile } from '@/lib/services/storage-service'

interface Testimonial {
  id?: string
  author_name: string
  author_role?: string | null
  author_avatar_url?: string | null
  content: string
  display_order: number
}

interface TestimonialsEditorProps {
  value: Testimonial[]
  onChange: (testimonials: Testimonial[]) => void
}

export function TestimonialsEditor({ value, onChange }: TestimonialsEditorProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(
    value.length > 0 ? value : []
  )
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null)
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({})

  const addTestimonial = () => {
    const newTestimonial: Testimonial = {
      author_name: '',
      author_role: '',
      author_avatar_url: null,
      content: '',
      display_order: testimonials.length,
    }
    const updated = [...testimonials, newTestimonial]
    setTestimonials(updated)
    onChange(updated)
  }

  const updateTestimonial = (
    index: number,
    field: keyof Testimonial,
    value: string
  ) => {
    const updated = [...testimonials]
    updated[index] = { ...updated[index], [field]: value || null }
    setTestimonials(updated)
    onChange(updated)
  }

  const removeTestimonial = async (index: number) => {
    const testimonial = testimonials[index]

    try {
      // Delete avatar if exists
      if (testimonial.author_avatar_url) {
        await deleteFile(testimonial.author_avatar_url, 'testimonial-avatars')
      }

      // Remove from list
      const updated = testimonials.filter((_, i) => i !== index)

      // Reorder remaining testimonials
      const reordered = updated.map((t, i) => ({
        ...t,
        display_order: i,
      }))

      setTestimonials(reordered)
      onChange(reordered)
      toast.success('Testimonial removed')
    } catch (error) {
      console.error('[TestimonialsEditor] Remove error:', error)
      toast.error('Failed to remove testimonial')
    }
  }

  const moveTestimonial = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === testimonials.length - 1)
    ) {
      return
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1
    const updated = [...testimonials]
    const temp = updated[index]
    updated[index] = updated[newIndex]
    updated[newIndex] = temp

    // Update display orders
    const reordered = updated.map((t, i) => ({
      ...t,
      display_order: i,
    }))

    setTestimonials(reordered)
    onChange(reordered)
  }

  const handleAvatarUpload = async (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    console.log('[TestimonialsEditor] Avatar file selected:', {
      name: file.name,
      type: file.type,
      size: file.size,
      index
    })

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.error('[TestimonialsEditor] Invalid file type:', file.type)
      toast.error('Please select an image file')
      return
    }

    // Validate file size (max 2MB for avatars)
    if (file.size > 2 * 1024 * 1024) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2)
      console.error('[TestimonialsEditor] File too large:', fileSizeMB + 'MB')
      toast.error(`Avatar size (${fileSizeMB}MB) must be less than 2MB`)
      return
    }

    try {
      console.log('[TestimonialsEditor] Starting avatar upload...')
      setUploadingIndex(index)

      // Delete old avatar if exists
      const testimonial = testimonials[index]
      if (testimonial.author_avatar_url) {
        console.log('[TestimonialsEditor] Deleting old avatar:', testimonial.author_avatar_url)
        await deleteFile(testimonial.author_avatar_url, 'testimonial-avatars')
      }

      // Upload new avatar
      console.log('[TestimonialsEditor] Uploading new avatar to testimonial-avatars bucket...')
      const url = await uploadImage(file, 'testimonial-avatars')
      console.log('[TestimonialsEditor] Avatar uploaded successfully, URL:', url)

      updateTestimonial(index, 'author_avatar_url', url)
      toast.success('Avatar uploaded successfully')
    } catch (error) {
      console.error('[TestimonialsEditor] Avatar upload error:', error)
      console.error('[TestimonialsEditor] Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace',
        error
      })

      // Show detailed error message
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload avatar'
      toast.error(errorMessage, {
        duration: 5000,
        description: 'Please try again or contact support if the problem persists'
      })
    } finally {
      setUploadingIndex(null)
      if (fileInputRefs.current[index]) {
        fileInputRefs.current[index]!.value = ''
      }
    }
  }

  const removeAvatar = async (index: number) => {
    const testimonial = testimonials[index]
    if (!testimonial.author_avatar_url) return

    try {
      await deleteFile(testimonial.author_avatar_url, 'testimonial-avatars')
      updateTestimonial(index, 'author_avatar_url', '')
      toast.success('Avatar removed')
    } catch (error) {
      console.error('[TestimonialsEditor] Remove avatar error:', error)
      toast.error('Failed to remove avatar')
    }
  }

  return (
    <div className="space-y-4">
      {testimonials.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">No testimonials added yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-start gap-4">
                <div className="flex flex-col gap-1 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => moveTestimonial(index, 'up')}
                    disabled={index === 0}
                  >
                    <GripVertical className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex-1 space-y-4">
                  {/* Avatar Upload */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                      {testimonial.author_avatar_url ? (
                        <img
                          src={testimonial.author_avatar_url}
                          alt={testimonial.author_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>

                    <div className="space-y-2">
                      <input
                        ref={(el) => { fileInputRefs.current[index] = el }}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleAvatarUpload(index, e)}
                        disabled={uploadingIndex === index}
                      />

                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRefs.current[index]?.click()}
                          disabled={uploadingIndex === index}
                        >
                          {uploadingIndex === index ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Upload className="h-3 w-3" />
                          )}
                          <span className="ml-2">
                            {testimonial.author_avatar_url ? 'Change' : 'Upload'}
                          </span>
                        </Button>

                        {testimonial.author_avatar_url && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAvatar(index)}
                            className="text-destructive"
                          >
                            Remove
                          </Button>
                        )}
                      </div>

                      <p className="text-xs text-muted-foreground">
                        PNG, JPG up to 2MB
                      </p>
                    </div>
                  </div>

                  {/* Author Information */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Author Name *</Label>
                      <Input
                        placeholder="e.g., Dr. John Smith"
                        value={testimonial.author_name}
                        onChange={(e) =>
                          updateTestimonial(index, 'author_name', e.target.value)
                        }
                        maxLength={100}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Author Role</Label>
                      <Input
                        placeholder="e.g., Dean, Medical College"
                        value={testimonial.author_role || ''}
                        onChange={(e) =>
                          updateTestimonial(index, 'author_role', e.target.value)
                        }
                        maxLength={100}
                      />
                    </div>
                  </div>

                  {/* Testimonial Content */}
                  <div className="space-y-2">
                    <Label>Content *</Label>
                    <Textarea
                      placeholder="The testimonial quote or feedback"
                      value={testimonial.content}
                      onChange={(e) =>
                        updateTestimonial(index, 'content', e.target.value)
                      }
                      className="min-h-[100px]"
                    />
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive flex-shrink-0"
                  onClick={() => removeTestimonial(index)}
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
        onClick={addTestimonial}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Testimonial
      </Button>
    </div>
  )
}
