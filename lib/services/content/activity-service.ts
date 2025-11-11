/**
 * Activity Service
 * Handles all CRUD operations for activities
 * Client-side service for real-time data fetching
 */

import { createClient } from '@/lib/supabase/client'
import type {
  Activity,
  ActivityFilters,
  ActivityResponse,
  CreateActivityDto,
  UpdateActivityDto,
  ActivitySummary,
} from '@/types/activity'

/**
 * Activity Service Class
 * Static methods for all activity operations
 */
export class ActivityService {
  private static supabase = createClient()

  /**
   * Error handler helper
   */
  private static handleError(error: unknown, context: string): Error {
    console.error(`[ActivityService] ${context} error:`, error)

    if (error instanceof Error) {
      return new Error(`${context} failed: ${error.message}`)
    }

    return new Error(`${context} failed: Unknown error occurred`)
  }

  /**
   * Get paginated list of activities with filters
   * Uses caching with 'minutes' profile for frequently accessed data
   *
   * @param filters - Filter criteria
   * @param page - Page number (1-indexed)
   * @param pageSize - Items per page
   * @returns Paginated activity response
   */
  static async getActivities(
    filters: ActivityFilters = {},
    page = 1,
    pageSize = 12
  ): Promise<ActivityResponse> {

    try {
      console.log('[ActivityService] Fetching activities with filters:', filters)

      const supabase = createClient()
      const offset = (page - 1) * pageSize

      // Build base query
      let query = supabase
        .from('activities')
        .select(
          `
          *,
          creator:profiles!created_by(id, full_name, email),
          metrics:activity_metrics(count),
          gallery:activity_gallery(count),
          testimonials:activity_testimonials(count)
        `,
          { count: 'exact' }
        )

      // Apply filters
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }

      if (filters.status) {
        query = query.eq('status', filters.status)
      }

      if (filters.category) {
        query = query.eq('category', filters.category)
      }

      if (filters.is_published !== undefined) {
        query = query.eq('is_published', filters.is_published)
      }

      if (filters.created_by) {
        query = query.eq('created_by', filters.created_by)
      }

      if (filters.date_from) {
        query = query.gte('activity_date', filters.date_from)
      }

      if (filters.date_to) {
        query = query.lte('activity_date', filters.date_to)
      }

      // Apply pagination and ordering
      query = query
        .order('created_at', { ascending: false })
        .range(offset, offset + pageSize - 1)

      // Execute query
      const { data, error, count } = await query

      if (error) {
        throw this.handleError(error, 'Get activities')
      }

      const total = count || 0
      const totalPages = Math.ceil(total / pageSize)

      console.log(`[ActivityService] Retrieved ${data?.length || 0} activities (total: ${total})`)

      return {
        data: (data || []) as Activity[],
        total,
        page,
        pageSize,
        totalPages,
      }
    } catch (error) {
      throw this.handleError(error, 'Get activities')
    }
  }

  /**
   * Get single activity by ID with all nested data
   * Uses caching with 'hours' profile for detailed views
   *
   * @param id - Activity UUID
   * @returns Activity with all relations or null
   */
  static async getActivityById(id: string): Promise<Activity | null> {

    try {
      console.log('[ActivityService] Fetching activity by ID:', id)

      const supabase = createClient()

      const { data, error } = await supabase
        .from('activities')
        .select(
          `
          *,
          creator:profiles!created_by(id, full_name, email),
          metrics:activity_metrics(*),
          impact_stats:activity_impact_stats(*),
          gallery:activity_gallery(*),
          testimonials:activity_testimonials(*)
        `
        )
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('[ActivityService] Activity not found:', id)
          return null
        }
        throw error
      }

      console.log('[ActivityService] Activity retrieved:', data.title)
      return data as Activity
    } catch (error) {
      throw this.handleError(error, 'Get activity by ID')
    }
  }

  /**
   * Get single activity by slug (for public pages)
   * Uses caching with 'hours' profile
   *
   * @param slug - Activity slug
   * @returns Activity with all relations or null
   */
  static async getActivityBySlug(slug: string): Promise<Activity | null> {

    try {
      console.log('[ActivityService] Fetching activity by slug:', slug)

      const supabase = createClient()

      const { data, error } = await supabase
        .from('activities')
        .select(
          `
          *,
          creator:profiles!created_by(id, full_name, email),
          metrics:activity_metrics(*),
          impact_stats:activity_impact_stats(*),
          gallery:activity_gallery(*),
          testimonials:activity_testimonials(*)
        `
        )
        .eq('slug', slug)
        .eq('is_published', true) // Only published for public access
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('[ActivityService] Activity not found:', slug)
          return null
        }
        throw error
      }

      console.log('[ActivityService] Activity retrieved:', data.title)
      return data as Activity
    } catch (error) {
      throw this.handleError(error, 'Get activity by slug')
    }
  }

  /**
   * Get activity summaries for selects/dropdowns
   * Uses caching with 'hours' profile
   *
   * @param publishedOnly - Return only published activities
   * @returns Array of activity summaries
   */
  static async getActivitySummaries(publishedOnly = false): Promise<ActivitySummary[]> {

    try {
      console.log('[ActivityService] Fetching activity summaries')

      const supabase = createClient()

      let query = supabase
        .from('activities')
        .select('id, title, slug, hero_image_url, status, category, progress, is_published')
        .order('title', { ascending: true })

      if (publishedOnly) {
        query = query.eq('is_published', true)
      }

      const { data, error } = await query

      if (error) {
        throw error
      }

      console.log(`[ActivityService] Retrieved ${data?.length || 0} activity summaries`)
      return (data || []) as ActivitySummary[]
    } catch (error) {
      throw this.handleError(error, 'Get activity summaries')
    }
  }

  /**
   * Create new activity with nested data
   * NOTE: This is NOT cached - it's a mutation
   *
   * @param dto - Create activity DTO
   * @param userId - ID of user creating the activity
   * @returns Created activity
   */
  static async createActivity(
    dto: CreateActivityDto,
    userId: string
  ): Promise<Activity> {
    try {
      console.log('[ActivityService] Creating activity:', dto.title)

      const supabase = createClient()

      // Start a transaction by inserting main activity first
      const { data: activity, error: activityError } = await supabase
        .from('activities')
        .insert([
          {
            title: dto.title,
            slug: dto.slug, // Will be auto-generated if not provided
            status: dto.status,
            category: dto.category,
            description: dto.description,
            vision_text: dto.vision_text || null,
            hero_image_url: dto.hero_image_url,
            progress: dto.progress || 0,
            impact: dto.impact || null,
            activity_date: dto.activity_date || null,
            is_published: dto.is_published || false,
            display_order: dto.display_order || 0,
            meta_title: dto.meta_title || null,
            meta_description: dto.meta_description || null,
            created_by: userId,
            updated_by: userId,
          },
        ])
        .select()
        .single()

      if (activityError) {
        throw activityError
      }

      console.log('[ActivityService] Activity created with ID:', activity.id)

      // Insert nested data
      await this.insertNestedData(activity.id, dto)

      // Fetch and return complete activity
      const completeActivity = await this.getActivityById(activity.id)

      if (!completeActivity) {
        throw new Error('Failed to retrieve created activity')
      }

      console.log('[ActivityService] Activity created successfully')
      return completeActivity
    } catch (error) {
      throw this.handleError(error, 'Create activity')
    }
  }

  /**
   * Update existing activity with nested data
   * NOTE: This is NOT cached - it's a mutation
   *
   * @param dto - Update activity DTO
   * @param userId - ID of user updating the activity
   * @returns Updated activity
   */
  static async updateActivity(
    dto: UpdateActivityDto,
    userId: string
  ): Promise<Activity> {
    try {
      console.log('[ActivityService] Updating activity:', dto.id)

      const supabase = createClient()

      // Build update object (only include provided fields)
      const updateData: any = {
        updated_by: userId,
      }

      if (dto.title !== undefined) updateData.title = dto.title
      if (dto.slug !== undefined) updateData.slug = dto.slug
      if (dto.status !== undefined) updateData.status = dto.status
      if (dto.category !== undefined) updateData.category = dto.category
      if (dto.description !== undefined) updateData.description = dto.description
      if (dto.vision_text !== undefined) updateData.vision_text = dto.vision_text
      if (dto.hero_image_url !== undefined) updateData.hero_image_url = dto.hero_image_url
      if (dto.progress !== undefined) updateData.progress = dto.progress
      if (dto.impact !== undefined) updateData.impact = dto.impact
      if (dto.activity_date !== undefined) updateData.activity_date = dto.activity_date
      if (dto.is_published !== undefined) updateData.is_published = dto.is_published
      if (dto.display_order !== undefined) updateData.display_order = dto.display_order
      if (dto.meta_title !== undefined) updateData.meta_title = dto.meta_title
      if (dto.meta_description !== undefined) updateData.meta_description = dto.meta_description

      // Update main activity
      const { data: activity, error: activityError } = await supabase
        .from('activities')
        .update(updateData)
        .eq('id', dto.id)
        .select()
        .single()

      if (activityError) {
        throw activityError
      }

      console.log('[ActivityService] Activity updated:', activity.id)

      // Update nested data if provided
      if (
        dto.metrics !== undefined ||
        dto.impact_stats !== undefined ||
        dto.gallery !== undefined ||
        dto.testimonials !== undefined
      ) {
        // Delete existing nested data and insert new
        await this.deleteNestedData(dto.id)
        await this.insertNestedData(dto.id, dto as CreateActivityDto)
      }

      // Fetch and return complete activity
      const completeActivity = await this.getActivityById(dto.id)

      if (!completeActivity) {
        throw new Error('Failed to retrieve updated activity')
      }

      console.log('[ActivityService] Activity updated successfully')
      return completeActivity
    } catch (error) {
      throw this.handleError(error, 'Update activity')
    }
  }

  /**
   * Delete activity (cascades to all nested data via database constraints)
   * NOTE: This is NOT cached - it's a mutation
   *
   * @param id - Activity UUID
   * @returns true if successful
   */
  static async deleteActivity(id: string): Promise<boolean> {
    try {
      console.log('[ActivityService] Deleting activity:', id)

      const supabase = createClient()

      const { error } = await supabase.from('activities').delete().eq('id', id)

      if (error) {
        throw error
      }

      console.log('[ActivityService] Activity deleted successfully')
      return true
    } catch (error) {
      throw this.handleError(error, 'Delete activity')
    }
  }

  /**
   * Toggle publish status
   * NOTE: This is NOT cached - it's a mutation
   *
   * @param id - Activity UUID
   * @param isPublished - New publish status
   * @param userId - ID of user making the change
   * @returns Updated activity
   */
  static async togglePublishStatus(
    id: string,
    isPublished: boolean,
    userId: string
  ): Promise<Activity> {
    try {
      console.log('[ActivityService] Toggling publish status:', id, isPublished)

      const supabase = createClient()

      const { data, error } = await supabase
        .from('activities')
        .update({ is_published: isPublished, updated_by: userId })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw error
      }

      // Fetch complete activity
      const completeActivity = await this.getActivityById(id)

      if (!completeActivity) {
        throw new Error('Failed to retrieve updated activity')
      }

      console.log('[ActivityService] Publish status toggled successfully')
      return completeActivity
    } catch (error) {
      throw this.handleError(error, 'Toggle publish status')
    }
  }

  /**
   * Helper: Insert nested data
   */
  private static async insertNestedData(
    activityId: string,
    dto: CreateActivityDto
  ): Promise<void> {
    const supabase = createClient()

    // Insert metrics
    if (dto.metrics && dto.metrics.length > 0) {
      const metricsToInsert = dto.metrics.map((metric, index) => ({
        activity_id: activityId,
        metric_key: metric.metric_key,
        metric_value: metric.metric_value,
        display_order: metric.display_order ?? index,
      }))

      const { error } = await supabase.from('activity_metrics').insert(metricsToInsert)
      if (error) throw error
    }

    // Insert impact stats
    if (dto.impact_stats && dto.impact_stats.length > 0) {
      const statsToInsert = dto.impact_stats.map((stat, index) => ({
        activity_id: activityId,
        label: stat.label,
        value: stat.value,
        icon: stat.icon || null,
        display_order: stat.display_order ?? index,
      }))

      const { error } = await supabase.from('activity_impact_stats').insert(statsToInsert)
      if (error) throw error
    }

    // Insert gallery images
    if (dto.gallery && dto.gallery.length > 0) {
      const galleryToInsert = dto.gallery.map((image, index) => ({
        activity_id: activityId,
        image_url: image.image_url,
        caption: image.caption || null,
        alt_text: image.alt_text || null,
        display_order: image.display_order ?? index,
      }))

      const { error } = await supabase.from('activity_gallery').insert(galleryToInsert)
      if (error) throw error
    }

    // Insert testimonials
    if (dto.testimonials && dto.testimonials.length > 0) {
      const testimonialsToInsert = dto.testimonials.map((testimonial, index) => ({
        activity_id: activityId,
        author_name: testimonial.author_name,
        author_role: testimonial.author_role || null,
        author_avatar_url: testimonial.author_avatar_url || null,
        content: testimonial.content,
        display_order: testimonial.display_order ?? index,
      }))

      const { error } = await supabase.from('activity_testimonials').insert(testimonialsToInsert)
      if (error) throw error
    }
  }

  /**
   * Helper: Delete nested data
   */
  private static async deleteNestedData(activityId: string): Promise<void> {
    const supabase = createClient()

    // Delete metrics
    await supabase.from('activity_metrics').delete().eq('activity_id', activityId)

    // Delete impact stats
    await supabase.from('activity_impact_stats').delete().eq('activity_id', activityId)

    // Delete gallery
    await supabase.from('activity_gallery').delete().eq('activity_id', activityId)

    // Delete testimonials
    await supabase.from('activity_testimonials').delete().eq('activity_id', activityId)
  }

  /**
   * Get activity statistics (for dashboard)
   * Uses caching with 'minutes' profile
   */
  static async getActivityStats() {

    try {
      const supabase = createClient()

      // Get counts by status
      const { data: statusCounts } = await supabase
        .from('activities')
        .select('status')
        .throwOnError()

      // Get counts by category
      const { data: categoryCounts } = await supabase
        .from('activities')
        .select('category')
        .throwOnError()

      // Get published count
      const { data: publishedCount } = await supabase
        .from('activities')
        .select('id', { count: 'exact', head: true })
        .eq('is_published', true)

      return {
        total: statusCounts?.length || 0,
        byStatus: this.countBy(statusCounts || [], 'status'),
        byCategory: this.countBy(categoryCounts || [], 'category'),
        published: publishedCount || 0,
      }
    } catch (error) {
      throw this.handleError(error, 'Get activity stats')
    }
  }

  /**
   * Helper: Count by field
   */
  private static countBy<T extends Record<string, any>>(
    array: T[],
    field: keyof T
  ): Record<string, number> {
    return array.reduce((acc, item) => {
      const key = item[field] as string
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }
}
