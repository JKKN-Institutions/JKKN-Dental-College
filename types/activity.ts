/**
 * TypeScript type definitions for Activity Module
 * Includes main activity, metrics, stats, gallery, and testimonials
 */

import { z } from 'zod'

// =====================================================
// ENUMS
// =====================================================

export const ActivityStatus = {
  PLANNED: 'planned',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
} as const

export type ActivityStatusType = typeof ActivityStatus[keyof typeof ActivityStatus]

// Category type is now dynamic - accepts any category slug from database
export type ActivityCategoryType = string

// =====================================================
// MAIN INTERFACES
// =====================================================

/**
 * Activity Metric (Key-Value pair)
 */
export interface ActivityMetric {
  id: string
  activity_id: string
  metric_key: string
  metric_value: string
  display_order: number
  created_at: string
}

/**
 * Activity Impact Stat (Label-Value-Icon)
 */
export interface ActivityImpactStat {
  id: string
  activity_id: string
  label: string
  value: string
  icon: string | null
  display_order: number
  created_at: string
}

/**
 * Activity Gallery Image
 */
export interface ActivityGalleryImage {
  id: string
  activity_id: string
  image_url: string
  caption: string | null
  alt_text: string | null
  display_order: number
  uploaded_at: string
}

/**
 * Activity Testimonial
 */
export interface ActivityTestimonial {
  id: string
  activity_id: string
  author_name: string
  author_role: string | null
  author_avatar_url: string | null
  content: string
  display_order: number
  created_at: string
}

/**
 * Main Activity Interface
 */
export interface Activity {
  // Core fields
  id: string
  title: string
  slug: string
  status: ActivityStatusType
  category: ActivityCategoryType

  // Content
  description: string
  vision_text: string | null

  // Media
  hero_image_url: string

  // Progress & Impact
  progress: number
  impact: string | null

  // Dates
  activity_date: string | null

  // Publishing
  is_published: boolean
  display_order: number

  // SEO
  meta_title: string | null
  meta_description: string | null

  // Audit
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null

  // Assignment fields (NEW)
  institution_id: string | null
  department_id: string | null
  assigned_to: string | null

  // Relations (optional, populated by joins)
  metrics?: ActivityMetric[]
  impact_stats?: ActivityImpactStat[]
  gallery?: ActivityGalleryImage[]
  testimonials?: ActivityTestimonial[]

  // Creator info (optional)
  creator?: {
    id: string
    full_name: string | null
    email: string
  }

  // Assignment relations (optional, populated by joins)
  institution?: {
    id: string
    name: string
  }
  department?: {
    id: string
    name: string
  }
  assigned_user?: {
    id: string
    full_name: string | null
    email: string
    avatar_url: string | null
    designation: string | null
  }
}

// =====================================================
// DTOs (Data Transfer Objects)
// =====================================================

/**
 * Create Activity DTO
 */
export interface CreateActivityDto {
  title: string
  slug?: string // Optional, will be auto-generated if not provided
  status: ActivityStatusType
  category: ActivityCategoryType
  description: string
  vision_text?: string
  hero_image_url: string
  progress?: number
  impact?: string
  activity_date?: string
  is_published?: boolean
  display_order?: number
  meta_title?: string
  meta_description?: string

  // Nested data (optional on create)
  metrics?: Omit<ActivityMetric, 'id' | 'activity_id' | 'created_at'>[]
  impact_stats?: Omit<ActivityImpactStat, 'id' | 'activity_id' | 'created_at'>[]
  gallery?: Omit<ActivityGalleryImage, 'id' | 'activity_id' | 'uploaded_at'>[]
  testimonials?: Omit<ActivityTestimonial, 'id' | 'activity_id' | 'created_at'>[]
}

/**
 * Update Activity DTO
 */
export interface UpdateActivityDto {
  id: string
  title?: string
  slug?: string
  status?: ActivityStatusType
  category?: ActivityCategoryType
  description?: string
  vision_text?: string
  hero_image_url?: string
  progress?: number
  impact?: string
  activity_date?: string
  is_published?: boolean
  display_order?: number
  meta_title?: string
  meta_description?: string

  // Nested data (will replace existing)
  metrics?: Omit<ActivityMetric, 'id' | 'activity_id' | 'created_at'>[]
  impact_stats?: Omit<ActivityImpactStat, 'id' | 'activity_id' | 'created_at'>[]
  gallery?: Omit<ActivityGalleryImage, 'id' | 'activity_id' | 'uploaded_at'>[]
  testimonials?: Omit<ActivityTestimonial, 'id' | 'activity_id' | 'created_at'>[]
}

/**
 * Activity Filters for List View
 */
export interface ActivityFilters {
  search?: string
  status?: ActivityStatusType
  category?: ActivityCategoryType
  is_published?: boolean
  created_by?: string
  date_from?: string
  date_to?: string

  // Assignment filters (NEW)
  institution_id?: string
  department_id?: string
  assigned_to?: string | 'me' | 'unassigned'
}

/**
 * Paginated Activity Response
 */
export interface ActivityResponse {
  data: Activity[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// =====================================================
// ZOD VALIDATION SCHEMAS
// =====================================================

/**
 * Activity Status Enum Schema
 */
export const ActivityStatusSchema = z.enum(['planned', 'ongoing', 'completed'], {
  message: 'Status must be either planned, ongoing, or completed',
})

/**
 * Activity Category Schema (Dynamic)
 * Accepts any category slug from database
 */
export const ActivityCategorySchema = z.string().min(1, 'Category is required')

/**
 * Activity Metric Schema (for nested data)
 */
export const ActivityMetricSchema = z.object({
  metric_key: z.string()
    .min(1, 'Metric key is required')
    .max(100, 'Metric key is too long (max 100 characters)'),
  metric_value: z.string()
    .min(1, 'Metric value is required')
    .max(100, 'Metric value is too long (max 100 characters)'),
  display_order: z.number().int().min(0).default(0),
})

/**
 * Activity Impact Stat Schema (for nested data)
 */
export const ActivityImpactStatSchema = z.object({
  label: z.string()
    .min(1, 'Label is required')
    .max(100, 'Label is too long (max 100 characters)'),
  value: z.string()
    .min(1, 'Value is required')
    .max(100, 'Value is too long (max 100 characters)'),
  icon: z.string()
    .max(50, 'Icon name is too long (max 50 characters)')
    .nullable()
    .optional(),
  display_order: z.number().int().min(0).default(0),
})

/**
 * Activity Gallery Image Schema (for nested data)
 */
export const ActivityGalleryImageSchema = z.object({
  image_url: z.string().url('Invalid image URL'),
  caption: z.string().nullable().optional(),
  alt_text: z.string()
    .max(255, 'Alt text is too long (max 255 characters)')
    .nullable()
    .optional(),
  display_order: z.number().int().min(0).default(0),
})

/**
 * Activity Testimonial Schema (for nested data)
 */
export const ActivityTestimonialSchema = z.object({
  author_name: z.string()
    .min(1, 'Author name is required')
    .max(100, 'Author name is too long (max 100 characters)'),
  author_role: z.string()
    .max(100, 'Author role is too long (max 100 characters)')
    .nullable()
    .optional(),
  author_avatar_url: z.string().url('Invalid avatar URL').nullable().optional(),
  content: z.string()
    .min(1, 'Testimonial content is required'),
  display_order: z.number().int().min(0).default(0),
})

/**
 * Create Activity Schema (for form validation)
 */
export const CreateActivitySchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(255, 'Title is too long (max 255 characters)'),
  slug: z.string()
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
    .optional(),
  status: ActivityStatusSchema,
  category: ActivityCategorySchema,
  description: z.string()
    .min(1, 'Description is required'),
  vision_text: z.string().nullable().optional(),
  hero_image_url: z.string()
    .refine((val) => !val || val.startsWith('http'), {
      message: 'Invalid hero image URL'
    })
    .optional()
    .or(z.literal('')),
  progress: z.number()
    .int('Progress must be a whole number')
    .min(0, 'Progress cannot be negative')
    .max(100, 'Progress cannot exceed 100')
    .default(0),
  impact: z.string()
    .max(100, 'Impact is too long (max 100 characters)')
    .nullable()
    .optional(),
  activity_date: z.string().nullable().optional(),
  is_published: z.boolean().default(false),
  display_order: z.number().int().min(0).default(0),
  meta_title: z.string()
    .max(60, 'Meta title is too long (max 60 characters)')
    .nullable()
    .optional(),
  meta_description: z.string()
    .max(160, 'Meta description is too long (max 160 characters)')
    .nullable()
    .optional(),

  // Assignment fields (NEW)
  institution_id: z.string().uuid('Invalid institution ID').nullable().optional(),
  department_id: z.string().uuid('Invalid department ID').nullable().optional(),
  assigned_to: z.string().uuid('Invalid assigned user ID').nullable().optional(),

  // Nested arrays
  metrics: z.array(ActivityMetricSchema).default([]),
  impact_stats: z.array(ActivityImpactStatSchema).default([]),
  gallery: z.array(ActivityGalleryImageSchema).default([]),
  testimonials: z.array(ActivityTestimonialSchema).default([]),
}).refine(
  (data) => {
    // If publishing, hero_image_url is required
    if (data.is_published && (!data.hero_image_url || data.hero_image_url === '')) {
      return false
    }
    return true
  },
  {
    message: 'Hero image is required when publishing an activity',
    path: ['hero_image_url'],
  }
)

/**
 * Update Activity Schema (all fields optional except id)
 */
export const UpdateActivitySchema = CreateActivitySchema.partial().extend({
  id: z.string().uuid('Invalid activity ID'),
})

/**
 * Activity Filters Schema
 */
export const ActivityFiltersSchema = z.object({
  search: z.string().optional(),
  status: ActivityStatusSchema.optional(),
  category: ActivityCategorySchema.optional(),
  is_published: z.boolean().optional(),
  created_by: z.string().uuid().optional(),
  date_from: z.string().optional(),
  date_to: z.string().optional(),

  // Assignment filters (NEW)
  institution_id: z.string().uuid().optional(),
  department_id: z.string().uuid().optional(),
  assigned_to: z.union([
    z.string().uuid(),
    z.literal('me'),
    z.literal('unassigned')
  ]).optional(),
})

// =====================================================
// TYPE INFERENCE FROM ZOD SCHEMAS
// =====================================================

export type CreateActivityInput = z.infer<typeof CreateActivitySchema>
export type UpdateActivityInput = z.infer<typeof UpdateActivitySchema>
export type ActivityFiltersInput = z.infer<typeof ActivityFiltersSchema>
export type ActivityMetricInput = z.infer<typeof ActivityMetricSchema>
export type ActivityImpactStatInput = z.infer<typeof ActivityImpactStatSchema>
export type ActivityGalleryImageInput = z.infer<typeof ActivityGalleryImageSchema>
export type ActivityTestimonialInput = z.infer<typeof ActivityTestimonialSchema>

// =====================================================
// HELPER TYPES
// =====================================================

/**
 * Activity with counts (for list view)
 */
export interface ActivityWithCounts extends Activity {
  metrics_count?: number
  gallery_count?: number
  testimonials_count?: number
}

/**
 * Activity summary (for selects, cards)
 */
export interface ActivitySummary {
  id: string
  title: string
  slug: string
  hero_image_url: string
  status: ActivityStatusType
  category: ActivityCategoryType
  progress: number
  is_published: boolean
}
