/**
 * Custom React Hook for Activity Categories
 * Manages state for fetching and managing activity categories
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type {
  ActivityCategory,
  CategorySummary,
  CategoryFilters,
} from '@/types/activity-category'

// =====================================================
// HOOKS
// =====================================================

interface UseCategoriesReturn {
  categories: ActivityCategory[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * Hook for fetching all categories with optional filters
 */
export function useCategories(
  filters: CategoryFilters = {}
): UseCategoriesReturn {
  const [categories, setCategories] = useState<ActivityCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const supabase = createClient()

      let query = supabase
        .from('activity_categories')
        .select('*')
        .order('display_order', { ascending: true })

      // Apply filters
      if (filters.search) {
        query = query.or(
          `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
        )
      }

      if (filters.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active)
      }

      const { data, error: fetchError } = await query

      if (fetchError) {
        throw fetchError
      }

      setCategories((data as ActivityCategory[]) || [])
    } catch (err) {
      console.error('[useCategories] Error:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch categories')
    } finally {
      setLoading(false)
    }
  }, [filters.search, filters.is_active])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  }
}

/**
 * Hook for fetching a single category by ID
 */
export function useCategory(id: string | null) {
  const [category, setCategory] = useState<ActivityCategory | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategory = useCallback(async () => {
    if (!id) {
      setCategory(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const supabase = createClient()

      const { data, error: fetchError } = await supabase
        .from('activity_categories')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          setError('Category not found')
          setCategory(null)
          return
        }
        throw fetchError
      }

      setCategory(data as ActivityCategory)
    } catch (err) {
      console.error('[useCategory] Error:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch category')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchCategory()
  }, [fetchCategory])

  return {
    category,
    loading,
    error,
    refetch: fetchCategory,
  }
}

/**
 * Hook for fetching category summaries (for dropdowns/selects)
 */
export function useCategorySummaries(activeOnly = false) {
  const [summaries, setSummaries] = useState<CategorySummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSummaries = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const supabase = createClient()

      let query = supabase
        .from('activity_categories')
        .select('id, name, slug, is_active')
        .order('display_order', { ascending: true })

      if (activeOnly) {
        query = query.eq('is_active', true)
      }

      const { data, error: fetchError } = await query

      if (fetchError) {
        throw fetchError
      }

      setSummaries((data as CategorySummary[]) || [])
    } catch (err) {
      console.error('[useCategorySummaries] Error:', err)
      setError(
        err instanceof Error ? err.message : 'Failed to fetch category summaries'
      )
    } finally {
      setLoading(false)
    }
  }, [activeOnly])

  useEffect(() => {
    fetchSummaries()
  }, [fetchSummaries])

  return {
    summaries,
    loading,
    error,
    refetch: fetchSummaries,
  }
}
