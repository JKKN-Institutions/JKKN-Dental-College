'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { PageService } from '@/lib/services/page-builder/page-service'
import { Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const createPageSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only'),
  description: z.string().optional(),
})

type CreatePageFormValues = z.infer<typeof createPageSchema>

export function CreatePageForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  const form = useForm<CreatePageFormValues>({
    resolver: zodResolver(createPageSchema),
    defaultValues: {
      title: '',
      slug: '',
      description: '',
    },
  })

  // Get current user on component mount
  useEffect(() => {
    async function getCurrentUser() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
      } else {
        toast.error('You must be logged in to create a page')
        router.push('/auth/login')
      }
    }
    getCurrentUser()
  }, [router])

  // Auto-generate slug from title
  const handleTitleChange = (value: string) => {
    const slug = value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    form.setValue('slug', slug)
  }

  const onSubmit = async (values: CreatePageFormValues) => {
    if (!userId) {
      toast.error('You must be logged in to create a page')
      router.push('/auth/login')
      return
    }

    setIsSubmitting(true)

    try {
      // Check if slug is available
      const isAvailable = await PageService.isSlugAvailable(values.slug)
      if (!isAvailable) {
        form.setError('slug', {
          message: 'This slug is already taken. Please choose another.',
        })
        setIsSubmitting(false)
        return
      }

      const page = await PageService.createPage({
        ...values,
        created_by: userId,
      })

      toast.success('Page created successfully!')
      router.push(`/admin/pages/${page.id}/edit`)
    } catch (error) {
      toast.error('Failed to create page')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Page Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="About Us"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e)
                    handleTitleChange(e.target.value)
                  }}
                />
              </FormControl>
              <FormDescription>
                The title that will appear in the browser tab and search results
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL Slug</FormLabel>
              <FormControl>
                <div className="flex items-center">
                  <span className="text-muted-foreground mr-2">/</span>
                  <Input placeholder="about-us" {...field} />
                </div>
              </FormControl>
              <FormDescription>
                The URL path for this page (e.g., /about-us). Only lowercase letters, numbers, and hyphens.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A brief description of this page..."
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Internal description to help you identify this page
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Page
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}
