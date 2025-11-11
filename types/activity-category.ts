/**
 * Activity Category Types
 * TypeScript interfaces and Zod schemas for activity categories
 */

import { z } from 'zod'

// =====================================================
// INTERFACES
// =====================================================

/**
 * Activity Category Interface
 */
export interface ActivityCategory {
  id: string
  name: string
  slug: string
  description: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null
}

/**
 * Category Summary (for dropdowns/selects)
 */
export interface CategorySummary {
  id: string
  name: string
  slug: string
  is_active: boolean
}

/**
 * Category Filters
 */
export interface CategoryFilters {
  search?: string
  is_active?: boolean
}

// =====================================================
// ZOD VALIDATION SCHEMAS
// =====================================================

/**
 * Create Category Schema
 */
export const CreateCategorySchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(50, 'Name is too long (max 50 characters)')
    .transform(val => val.trim()),

  slug: z.string()
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
    .optional(),

  description: z.string()
    .max(500, 'Description is too long (max 500 characters)')
    .nullable()
    .optional(),

  display_order: z.number()
    .int('Display order must be a whole number')
    .min(0, 'Display order cannot be negative')
    .default(0),

  is_active: z.boolean().default(true),
})

/**
 * Update Category Schema (all fields optional except id)
 */
export const UpdateCategorySchema = z.object({
  id: z.string().uuid('Invalid category ID'),
  name: z.string()
    .min(1, 'Name is required')
    .max(50, 'Name is too long (max 50 characters)')
    .transform(val => val.trim())
    .optional(),

  slug: z.string()
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
    .optional(),

  description: z.string()
    .max(500, 'Description is too long (max 500 characters)')
    .nullable()
    .optional(),

  display_order: z.number()
    .int('Display order must be a whole number')
    .min(0, 'Display order cannot be negative')
    .optional(),

  is_active: z.boolean().optional(),
})

// Inferred types
export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>
export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>
