/**
 * Category Form Component
 * Form for creating and editing activity categories
 */

'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import { CreateCategorySchema, type CreateCategoryInput } from '@/types/activity-category'
import type { ActivityCategory } from '@/types/activity-category'
import { createCategory, updateCategory } from '@/app/actions/activity-categories'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'

interface CategoryFormProps {
  initialData?: ActivityCategory
}

export function CategoryForm({ initialData }: CategoryFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const isEditMode = !!initialData

  // Initialize form with default values
  const form = useForm<CreateCategoryInput>({
    resolver: zodResolver(CreateCategorySchema) as any,
    defaultValues: {
      name: initialData?.name || '',
      slug: initialData?.slug,
      description: initialData?.description || undefined,
      display_order: initialData?.display_order ?? 0,
      is_active: initialData?.is_active ?? true,
    },
  })

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    if (!isEditMode || !initialData?.slug) {
      const slug = name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
      form.setValue('slug', slug)
    }
  }

  // Handle form submission
  const onSubmit = async (data: CreateCategoryInput) => {
    startTransition(async () => {
      try {
        // Prepare FormData
        const formData = new FormData()

        // Add all fields
        Object.entries(data).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            formData.append(key, value.toString())
          }
        })

        // Add category ID for edit mode
        if (isEditMode && initialData?.id) {
          formData.append('id', initialData.id)
        }

        // Call server action
        const result = isEditMode
          ? await updateCategory({ success: false, message: '' }, formData)
          : await createCategory({ success: false, message: '' }, formData)

        if (result.success) {
          toast.success(
            isEditMode
              ? 'Category updated successfully'
              : 'Category created successfully'
          )
          router.push('/admin/activities/categories')
          router.refresh()
        } else {
          toast.error(result.message || 'Failed to save category')
        }
      } catch (error) {
        console.error('[CategoryForm] Submit error:', error)
        toast.error('An unexpected error occurred')
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Core category details and identification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Environment"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        handleNameChange(e.target.value)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Slug */}
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="environment"
                      {...field}
                      value={field.value || ''}
                      disabled={isEditMode}
                    />
                  </FormControl>
                  <FormDescription>
                    URL-friendly identifier (auto-generated, cannot be changed after creation)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of this category"
                      className="min-h-[100px]"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>
                    {field.value?.length || 0}/500 characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>
              Display order and visibility
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Display Order */}
            <FormField
              control={form.control}
              name="display_order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Order</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                    />
                  </FormControl>
                  <FormDescription>
                    Lower numbers appear first
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Is Active */}
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Active Status
                    </FormLabel>
                    <FormDescription>
                      Make this category available for selection
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex items-center justify-between gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isPending}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditMode ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isEditMode ? 'Update Category' : 'Create Category'}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
