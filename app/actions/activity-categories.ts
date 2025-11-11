/**
 * Server Actions for Activity Categories Module
 * Handles all mutations (create, update, delete) with cache invalidation
 */

'use server'

import { redirect } from 'next/navigation'
import { revalidatePath, revalidateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import {
  CreateCategorySchema,
  UpdateCategorySchema,
  type CreateCategoryInput,
  type UpdateCategoryInput,
} from '@/types/activity-category'

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
 * Create new activity category
 */
export async function createCategory(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const user = await getCurrentUser()

    // Extract and validate data
    const rawData = {
      name: formData.get('name'),
      slug: formData.get('slug') || undefined,
      description: formData.get('description') || null,
      display_order: formData.get('display_order')
        ? parseInt(formData.get('display_order') as string, 10)
        : 0,
      is_active: formData.get('is_active') === 'true',
    }

    const validation = CreateCategorySchema.safeParse(rawData)

    if (!validation.success) {
      return {
        success: false,
        message: 'Invalid fields. Please check the form.',
        errors: validation.error.flatten().fieldErrors,
      }
    }

    const supabase = await createClient()

    // Insert category
    const { data: category, error } = await supabase
      .from('activity_categories')
      .insert([
        {
          ...validation.data,
          created_by: user.id,
          updated_by: user.id,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('[createCategory] Database error:', error)
      return {
        success: false,
        message: error.message || 'Failed to create category',
      }
    }

    // Invalidate cache
    revalidateTag('activity-categories')
    revalidateTag('activity-categories-list')
    revalidatePath('/admin/activities/categories')

    return {
      success: true,
      message: 'Category created successfully',
      data: category,
    }
  } catch (error) {
    console.error('[createCategory] Error:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create category',
    }
  }
}

/**
 * Update existing activity category
 */
export async function updateCategory(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const user = await getCurrentUser()

    const categoryId = formData.get('id') as string
    if (!categoryId) {
      return {
        success: false,
        message: 'Category ID is required',
      }
    }

    // Extract and validate data
    const rawData = {
      id: categoryId,
      name: formData.get('name') || undefined,
      slug: formData.get('slug') || undefined,
      description: formData.get('description') || null,
      display_order: formData.get('display_order')
        ? parseInt(formData.get('display_order') as string, 10)
        : undefined,
      is_active: formData.get('is_active') === 'true',
    }

    const validation = UpdateCategorySchema.safeParse(rawData)

    if (!validation.success) {
      return {
        success: false,
        message: 'Invalid fields. Please check the form.',
        errors: validation.error.flatten().fieldErrors,
      }
    }

    const supabase = await createClient()

    // Update category
    const { data: category, error } = await supabase
      .from('activity_categories')
      .update({
        ...validation.data,
        updated_by: user.id,
      })
      .eq('id', categoryId)
      .select()
      .single()

    if (error) {
      console.error('[updateCategory] Database error:', error)
      return {
        success: false,
        message: error.message || 'Failed to update category',
      }
    }

    // Invalidate cache
    revalidateTag('activity-categories')
    revalidateTag('activity-categories-list')
    revalidateTag(`activity-category-${categoryId}`)
    revalidatePath('/admin/activities/categories')
    revalidatePath(`/admin/activities/categories/${categoryId}`)

    return {
      success: true,
      message: 'Category updated successfully',
      data: category,
    }
  } catch (error) {
    console.error('[updateCategory] Error:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update category',
    }
  }
}

/**
 * Delete activity category
 */
export async function deleteCategory(categoryId: string): Promise<FormState> {
  try {
    await getCurrentUser()

    const supabase = await createClient()

    // Check if category is being used by any activities
    const { count, error: countError } = await supabase
      .from('activities')
      .select('id', { count: 'exact', head: true })
      .eq('category', categoryId)

    if (countError) {
      console.error('[deleteCategory] Count error:', countError)
      return {
        success: false,
        message: 'Failed to check category usage',
      }
    }

    if (count && count > 0) {
      return {
        success: false,
        message: `Cannot delete category. It is being used by ${count} ${count === 1 ? 'activity' : 'activities'}.`,
      }
    }

    // Delete category
    const { error } = await supabase
      .from('activity_categories')
      .delete()
      .eq('id', categoryId)

    if (error) {
      console.error('[deleteCategory] Database error:', error)
      return {
        success: false,
        message: error.message || 'Failed to delete category',
      }
    }

    // Invalidate cache
    revalidateTag('activity-categories')
    revalidateTag('activity-categories-list')
    revalidateTag(`activity-category-${categoryId}`)
    revalidatePath('/admin/activities/categories')

    return {
      success: true,
      message: 'Category deleted successfully',
    }
  } catch (error) {
    console.error('[deleteCategory] Error:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to delete category',
    }
  }
}

/**
 * Toggle category active status
 */
export async function toggleCategoryStatus(
  categoryId: string,
  isActive: boolean
): Promise<FormState> {
  try {
    const user = await getCurrentUser()

    const supabase = await createClient()

    const { error } = await supabase
      .from('activity_categories')
      .update({
        is_active: isActive,
        updated_by: user.id,
      })
      .eq('id', categoryId)

    if (error) {
      console.error('[toggleCategoryStatus] Database error:', error)
      return {
        success: false,
        message: error.message || 'Failed to update category status',
      }
    }

    // Invalidate cache
    revalidateTag('activity-categories')
    revalidateTag('activity-categories-list')
    revalidateTag(`activity-category-${categoryId}`)
    revalidatePath('/admin/activities/categories')

    return {
      success: true,
      message: `Category ${isActive ? 'activated' : 'deactivated'} successfully`,
    }
  } catch (error) {
    console.error('[toggleCategoryStatus] Error:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update category status',
    }
  }
}
