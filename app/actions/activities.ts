/**
 * Server Actions for Activity Module
 * Handles all mutations (create, update, delete) with cache invalidation
 */

'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import {
  CreateActivitySchema,
  UpdateActivitySchema,
  type CreateActivityInput,
  type UpdateActivityInput,
} from '@/types/activity'

// Form state type for client-side error handling
export type FormState = {
  success?: boolean
  message?: string
  errors?: {
    [key: string]: string[]
  }
  data?: any
}

/**
 * Get current authenticated user
 */
async function getCurrentUser() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Unauthorized: Please log in to continue')
  }

  return user
}

/**
 * Create new activity
 *
 * @param prevState - Previous form state
 * @param formData - Form data from client
 * @returns Form state with success/error
 */
export async function createActivity(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  console.log('========================================')
  console.log('[createActivity] Server action called')
  console.log('========================================')

  try {
    console.log('[createActivity] Step 1: Getting authenticated user...')
    // Get authenticated user
    const user = await getCurrentUser()
    console.log('[createActivity] User authenticated:', user.id)

    console.log('[createActivity] Step 2: Parsing form data...')
    // Log all form data entries
    console.log('[createActivity] FormData entries:')
    for (const [key, value] of formData.entries()) {
      console.log(`  ${key}:`, typeof value === 'string' && value.length > 100 ? value.substring(0, 100) + '...' : value)
    }

    // Parse form data
    const rawData = {
      title: formData.get('title'),
      slug: formData.get('slug') || undefined,
      status: formData.get('status'),
      category: formData.get('category'),
      description: formData.get('description'),
      vision_text: formData.get('vision_text') || undefined,
      hero_image_url: formData.get('hero_image_url'),
      progress: Number(formData.get('progress')) || 0,
      impact: formData.get('impact') || undefined,
      activity_date: formData.get('activity_date') || undefined,
      is_published: formData.get('is_published') === 'true',
      display_order: Number(formData.get('display_order')) || 0,
      meta_title: formData.get('meta_title') || undefined,
      meta_description: formData.get('meta_description') || undefined,
      // Nested data (JSON strings)
      metrics: formData.get('metrics')
        ? JSON.parse(formData.get('metrics') as string)
        : [],
      impact_stats: formData.get('impact_stats')
        ? JSON.parse(formData.get('impact_stats') as string)
        : [],
      gallery: formData.get('gallery')
        ? JSON.parse(formData.get('gallery') as string)
        : [],
      testimonials: formData.get('testimonials')
        ? JSON.parse(formData.get('testimonials') as string)
        : [],
    }

    console.log('[createActivity] Raw data parsed:', {
      title: rawData.title,
      slug: rawData.slug,
      status: rawData.status,
      category: rawData.category,
      metricsCount: rawData.metrics.length,
      statsCount: rawData.impact_stats.length,
      galleryCount: rawData.gallery.length,
      testimonialsCount: rawData.testimonials.length,
    })

    console.log('[createActivity] Step 3: Validating with Zod schema...')
    // Validate with Zod
    const validation = CreateActivitySchema.safeParse(rawData)
    console.log('[createActivity] Validation result:', validation.success ? 'SUCCESS' : 'FAILED')

    if (!validation.success) {
      console.error('[createActivity] Validation failed!')
      console.error('[createActivity] Validation errors:', validation.error.flatten().fieldErrors)
      return {
        success: false,
        errors: validation.error.flatten().fieldErrors,
        message: 'Validation failed. Please check the form for errors.',
      }
    }

    console.log('[createActivity] Validation successful!')
    const validatedData = validation.data

    console.log('[createActivity] Step 4: Creating Supabase client...')
    // Create activity in database
    const supabase = await createClient()
    console.log('[createActivity] Supabase client created')

    console.log('[createActivity] Step 5: Inserting main activity record...')
    console.log('[createActivity] Activity data to insert:', {
      title: validatedData.title,
      slug: validatedData.slug,
      status: validatedData.status,
      category: validatedData.category,
    })

    // Insert main activity
    const { data: activity, error: activityError } = await supabase
      .from('activities')
      .insert([
        {
          title: validatedData.title,
          slug: validatedData.slug,
          status: validatedData.status,
          category: validatedData.category,
          description: validatedData.description,
          vision_text: validatedData.vision_text || null,
          hero_image_url: validatedData.hero_image_url,
          progress: validatedData.progress,
          impact: validatedData.impact || null,
          activity_date: validatedData.activity_date || null,
          is_published: validatedData.is_published,
          display_order: validatedData.display_order,
          meta_title: validatedData.meta_title || null,
          meta_description: validatedData.meta_description || null,
          created_by: user.id,
          updated_by: user.id,
        },
      ])
      .select()
      .single()

    if (activityError) {
      console.error('[createActivity] Database error:', activityError)
      console.error('[createActivity] Error code:', activityError.code)
      console.error('[createActivity] Error details:', activityError.details)
      console.error('[createActivity] Error hint:', activityError.hint)
      return {
        success: false,
        message: `Database error: ${activityError.message}`,
      }
    }

    console.log('[createActivity] Activity inserted successfully! ID:', activity.id)

    // Insert nested data
    const activityId = activity.id
    console.log('[createActivity] Step 6: Inserting nested data...')

    // Insert metrics
    if (validatedData.metrics.length > 0) {
      console.log('[createActivity] Inserting metrics:', validatedData.metrics.length, 'items')
      const { error } = await supabase.from('activity_metrics').insert(
        validatedData.metrics.map((metric, index) => ({
          activity_id: activityId,
          metric_key: metric.metric_key,
          metric_value: metric.metric_value,
          display_order: metric.display_order ?? index,
        }))
      )
      if (error) {
        console.error('[createActivity] Metrics insert error:', error)
      } else {
        console.log('[createActivity] Metrics inserted successfully')
      }
    }

    // Insert impact stats
    if (validatedData.impact_stats.length > 0) {
      console.log('[createActivity] Inserting impact stats:', validatedData.impact_stats.length, 'items')
      const { error } = await supabase.from('activity_impact_stats').insert(
        validatedData.impact_stats.map((stat, index) => ({
          activity_id: activityId,
          label: stat.label,
          value: stat.value,
          icon: stat.icon || null,
          display_order: stat.display_order ?? index,
        }))
      )
      if (error) {
        console.error('[createActivity] Stats insert error:', error)
      } else {
        console.log('[createActivity] Impact stats inserted successfully')
      }
    }

    // Insert gallery
    if (validatedData.gallery.length > 0) {
      console.log('[createActivity] Inserting gallery images:', validatedData.gallery.length, 'items')
      const { error } = await supabase.from('activity_gallery').insert(
        validatedData.gallery.map((image, index) => ({
          activity_id: activityId,
          image_url: image.image_url,
          caption: image.caption || null,
          alt_text: image.alt_text || null,
          display_order: image.display_order ?? index,
        }))
      )
      if (error) {
        console.error('[createActivity] Gallery insert error:', error)
      } else {
        console.log('[createActivity] Gallery inserted successfully')
      }
    }

    // Insert testimonials
    if (validatedData.testimonials.length > 0) {
      console.log('[createActivity] Inserting testimonials:', validatedData.testimonials.length, 'items')
      const { error } = await supabase.from('activity_testimonials').insert(
        validatedData.testimonials.map((testimonial, index) => ({
          activity_id: activityId,
          author_name: testimonial.author_name,
          author_role: testimonial.author_role || null,
          author_avatar_url: testimonial.author_avatar_url || null,
          content: testimonial.content,
          display_order: testimonial.display_order ?? index,
        }))
      )
      if (error) {
        console.error('[createActivity] Testimonials insert error:', error)
      } else {
        console.log('[createActivity] Testimonials inserted successfully')
      }
    }

    console.log('[createActivity] Step 7: Revalidating cache...')
    // Instant cache invalidation
    revalidateTag('activities')
    revalidateTag('activities-list')
    revalidatePath('/admin/activities')
    console.log('[createActivity] Cache revalidated')

    console.log('[createActivity] SUCCESS! Activity created:', activity.id)
    console.log('========================================')

    // Return success with activity data (let client handle redirect)
    return {
      success: true,
      message: 'Activity created successfully',
      data: activity,
    }
  } catch (error) {
    console.error('========================================')
    console.error('[createActivity] CRITICAL ERROR!')
    console.error('[createActivity] Error type:', typeof error)
    console.error('[createActivity] Error:', error)
    console.error('[createActivity] Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    console.error('========================================')

    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      }
    }

    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    }
  }
}

/**
 * Update existing activity
 *
 * @param prevState - Previous form state
 * @param formData - Form data from client
 * @returns Form state with success/error
 */
export async function updateActivity(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    // Get authenticated user
    const user = await getCurrentUser()

    const activityId = formData.get('id') as string

    if (!activityId) {
      return {
        success: false,
        message: 'Activity ID is required',
      }
    }

    // Parse form data (similar to create)
    const rawData = {
      id: activityId,
      title: formData.get('title'),
      slug: formData.get('slug') || undefined,
      status: formData.get('status'),
      category: formData.get('category'),
      description: formData.get('description'),
      vision_text: formData.get('vision_text') || undefined,
      hero_image_url: formData.get('hero_image_url'),
      progress: Number(formData.get('progress')) || 0,
      impact: formData.get('impact') || undefined,
      activity_date: formData.get('activity_date') || undefined,
      is_published: formData.get('is_published') === 'true',
      display_order: Number(formData.get('display_order')) || 0,
      meta_title: formData.get('meta_title') || undefined,
      meta_description: formData.get('meta_description') || undefined,
      metrics: formData.get('metrics')
        ? JSON.parse(formData.get('metrics') as string)
        : [],
      impact_stats: formData.get('impact_stats')
        ? JSON.parse(formData.get('impact_stats') as string)
        : [],
      gallery: formData.get('gallery')
        ? JSON.parse(formData.get('gallery') as string)
        : [],
      testimonials: formData.get('testimonials')
        ? JSON.parse(formData.get('testimonials') as string)
        : [],
    }

    // Validate with Zod (partial validation for updates)
    const validation = UpdateActivitySchema.safeParse(rawData)

    if (!validation.success) {
      return {
        success: false,
        errors: validation.error.flatten().fieldErrors,
        message: 'Validation failed. Please check the form for errors.',
      }
    }

    const validatedData = validation.data

    // Update activity in database
    const supabase = await createClient()

    const { data: activity, error: activityError } = await supabase
      .from('activities')
      .update({
        title: validatedData.title,
        slug: validatedData.slug,
        status: validatedData.status,
        category: validatedData.category,
        description: validatedData.description,
        vision_text: validatedData.vision_text || null,
        hero_image_url: validatedData.hero_image_url,
        progress: validatedData.progress,
        impact: validatedData.impact || null,
        activity_date: validatedData.activity_date || null,
        is_published: validatedData.is_published,
        display_order: validatedData.display_order,
        meta_title: validatedData.meta_title || null,
        meta_description: validatedData.meta_description || null,
        updated_by: user.id,
      })
      .eq('id', activityId)
      .select()
      .single()

    if (activityError) {
      console.error('[updateActivity] Database error:', activityError)
      return {
        success: false,
        message: `Database error: ${activityError.message}`,
      }
    }

    // Delete existing nested data
    await supabase.from('activity_metrics').delete().eq('activity_id', activityId)
    await supabase.from('activity_impact_stats').delete().eq('activity_id', activityId)
    await supabase.from('activity_gallery').delete().eq('activity_id', activityId)
    await supabase.from('activity_testimonials').delete().eq('activity_id', activityId)

    // Insert new nested data (same as create)
    if (validatedData.metrics && validatedData.metrics.length > 0) {
      await supabase.from('activity_metrics').insert(
        validatedData.metrics.map((metric, index) => ({
          activity_id: activityId,
          metric_key: metric.metric_key,
          metric_value: metric.metric_value,
          display_order: metric.display_order ?? index,
        }))
      )
    }

    if (validatedData.impact_stats && validatedData.impact_stats.length > 0) {
      await supabase.from('activity_impact_stats').insert(
        validatedData.impact_stats.map((stat, index) => ({
          activity_id: activityId,
          label: stat.label,
          value: stat.value,
          icon: stat.icon || null,
          display_order: stat.display_order ?? index,
        }))
      )
    }

    if (validatedData.gallery && validatedData.gallery.length > 0) {
      await supabase.from('activity_gallery').insert(
        validatedData.gallery.map((image, index) => ({
          activity_id: activityId,
          image_url: image.image_url,
          caption: image.caption || null,
          alt_text: image.alt_text || null,
          display_order: image.display_order ?? index,
        }))
      )
    }

    if (validatedData.testimonials && validatedData.testimonials.length > 0) {
      await supabase.from('activity_testimonials').insert(
        validatedData.testimonials.map((testimonial, index) => ({
          activity_id: activityId,
          author_name: testimonial.author_name,
          author_role: testimonial.author_role || null,
          author_avatar_url: testimonial.author_avatar_url || null,
          content: testimonial.content,
          display_order: testimonial.display_order ?? index,
        }))
      )
    }

    // Instant cache invalidation
    revalidateTag('activities')
    revalidateTag('activities-list')
    revalidateTag(`activity-${activityId}`)
    revalidatePath('/admin/activities')
    revalidatePath(`/admin/activities/${activityId}`)

    console.log('[updateActivity] Activity updated successfully:', activity.id)

    return {
      success: true,
      message: 'Activity updated successfully',
      data: activity,
    }
  } catch (error) {
    console.error('[updateActivity] Unexpected error:', error)

    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      }
    }

    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    }
  }
}

/**
 * Delete activity
 *
 * @param activityId - Activity UUID
 * @returns Form state with success/error
 */
export async function deleteActivity(activityId: string): Promise<FormState> {
  try {
    // Get authenticated user
    const user = await getCurrentUser()

    const supabase = await createClient()

    // Delete activity (cascades to all nested data)
    const { error } = await supabase.from('activities').delete().eq('id', activityId)

    if (error) {
      console.error('[deleteActivity] Database error:', error)
      return {
        success: false,
        message: `Failed to delete activity: ${error.message}`,
      }
    }

    // Instant cache invalidation
    revalidateTag('activities')
    revalidateTag('activities-list')
    revalidateTag(`activity-${activityId}`)
    revalidatePath('/admin/activities')

    console.log('[deleteActivity] Activity deleted successfully:', activityId)

    return {
      success: true,
      message: 'Activity deleted successfully',
    }
  } catch (error) {
    console.error('[deleteActivity] Unexpected error:', error)

    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      }
    }

    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    }
  }
}

/**
 * Toggle publish status
 *
 * @param activityId - Activity UUID
 * @param isPublished - New publish status
 * @returns Form state with success/error
 */
export async function togglePublishStatus(
  activityId: string,
  isPublished: boolean
): Promise<FormState> {
  try {
    // Get authenticated user
    const user = await getCurrentUser()

    const supabase = await createClient()

    const { data, error } = await supabase
      .from('activities')
      .update({
        is_published: isPublished,
        updated_by: user.id,
      })
      .eq('id', activityId)
      .select()
      .single()

    if (error) {
      console.error('[togglePublishStatus] Database error:', error)
      return {
        success: false,
        message: `Failed to update publish status: ${error.message}`,
      }
    }

    // Instant cache invalidation
    revalidateTag('activities')
    revalidateTag('activities-list')
    revalidateTag(`activity-${activityId}`)
    revalidatePath('/admin/activities')
    revalidatePath(`/admin/activities/${activityId}`)

    console.log('[togglePublishStatus] Publish status updated:', activityId, isPublished)

    return {
      success: true,
      message: `Activity ${isPublished ? 'published' : 'unpublished'} successfully`,
      data,
    }
  } catch (error) {
    console.error('[togglePublishStatus] Unexpected error:', error)

    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      }
    }

    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    }
  }
}
