// =====================================================
// HERO SECTION DATA TABLE SCHEMA
// =====================================================
// Purpose: Zod validation schema for hero section forms
// Module: content/hero-sections
// Layer: Components (Validation)
// =====================================================

import { z } from 'zod';

/**
 * Zod schema for hero section form validation
 */
export const heroSectionSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must not exceed 100 characters'),

  tagline: z
    .string()
    .min(1, 'Tagline is required')
    .min(10, 'Tagline must be at least 10 characters')
    .max(200, 'Tagline must not exceed 200 characters'),

  news_ticker_text: z
    .string()
    .max(500, 'News ticker must not exceed 500 characters')
    .optional()
    .or(z.literal('')),

  primary_cta_text: z
    .string()
    .min(1, 'Primary button text is required')
    .max(30, 'Button text must not exceed 30 characters'),

  primary_cta_link: z
    .string()
    .url('Must be a valid URL or path starting with /')
    .or(z.string().regex(/^\//, 'Path must start with /'))
    .optional()
    .or(z.literal('')),

  secondary_cta_text: z
    .string()
    .min(1, 'Secondary button text is required')
    .max(30, 'Button text must not exceed 30 characters'),

  secondary_cta_link: z
    .string()
    .url('Must be a valid URL or path starting with /')
    .or(z.string().regex(/^\//, 'Path must start with /'))
    .optional()
    .or(z.literal('')),

  video_url: z
    .string()
    .url('Must be a valid video URL')
    .or(z.string().regex(/^\//, 'Path must start with /'))
    .optional()
    .or(z.literal('')),

  poster_image_url: z
    .string()
    .url('Must be a valid image URL')
    .or(z.string().regex(/^\//, 'Path must start with /'))
    .optional()
    .or(z.literal('')),

  is_active: z.boolean().default(false),

  display_order: z.coerce
    .number()
    .int('Must be an integer')
    .min(0, 'Must be 0 or greater')
    .default(0),
});

export type HeroSectionFormData = z.infer<typeof heroSectionSchema>;
