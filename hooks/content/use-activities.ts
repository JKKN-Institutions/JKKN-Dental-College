/**
 * Custom React Hook for Activities List
 * Manages state for fetching, filtering, and paginating activities
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type {
  Activity,
  ActivityFilters,
  ActivitySummary,
} from '@/types/activity'

interface UseActivitiesReturn {
  activities: Activity[]
  loading: boolean
  error: string | null
  total: number
  page: number
  pageSize: number
  totalPages: number
  setPage: (page: number) => void
  setPageSize: (size: number) => void
  refetch: () => Promise<void>
}

/**
 * Hook for managing activities list with filters and pagination
 */
export function useActivities(
  filters: ActivityFilters = {},
  initialPageSize = 12
): UseActivitiesReturn {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      console.log('[useActivities] Fetching activities with filters:', filters, 'page:', page, 'pageSize:', pageSize)

      const supabase = createClient()
      const offset = (page - 1) * pageSize

      // Build query
      let query = supabase
        .from('activities')
        .select(
          `
          *,
          creator:profiles!activities_created_by_fkey(id, full_name, email),
          institution:institutions(id, name),
          department:departments(id, name),
          assigned_user:profiles!activities_assigned_to_fkey(id, full_name, email, avatar_url, designation)
        `,
          { count: 'exact' }
        )

      // Apply filters
      if (filters.search) {
        query = query.or(
          `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
        )
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

      // Apply assignment filters (NEW)
      if (filters.institution_id) {
        query = query.eq('institution_id', filters.institution_id)
      }

      if (filters.department_id) {
        query = query.eq('department_id', filters.department_id)
      }

      if (filters.assigned_to) {
        if (filters.assigned_to === 'unassigned') {
          // Show activities not assigned to anyone
          query = query.is('assigned_to', null)
        } else if (filters.assigned_to === 'me') {
          // Show activities assigned to current user
          const { data: { user } } = await supabase.auth.getUser()
          if (user) {
            query = query.eq('assigned_to', user.id)
          }
        } else {
          // Show activities assigned to specific user
          query = query.eq('assigned_to', filters.assigned_to)
        }
      }

      // Apply pagination and ordering
      query = query
        .order('created_at', { ascending: false })
        .range(offset, offset + pageSize - 1)

      const { data, error: fetchError, count } = await query

      console.log('[useActivities] Query result:', { data, error: fetchError, count })

      if (fetchError) {
        console.error('[useActivities] Fetch error:', fetchError)
        throw fetchError
      }

      console.log('[useActivities] Success! Activities:', data?.length, 'Total:', count)
      setActivities((data as Activity[]) || [])
      setTotal(count || 0)
    } catch (err) {
      console.error('[useActivities] Error:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch activities')
    } finally {
      console.log('[useActivities] Setting loading to false')
      setLoading(false)
    }
  }, [filters, page, pageSize])

  useEffect(() => {
    fetchActivities()
  }, [fetchActivities])

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1)
  }, [
    filters.search,
    filters.status,
    filters.category,
    filters.is_published,
    filters.institution_id,
    filters.department_id,
    filters.assigned_to,
  ])

  const totalPages = Math.ceil(total / pageSize)

  return {
    activities,
    loading,
    error,
    total,
    page,
    pageSize,
    totalPages,
    setPage,
    setPageSize,
    refetch: fetchActivities,
  }
}

/**
 * Hook for fetching a single activity by ID
 */
export function useActivity(id: string | null) {
  const [activity, setActivity] = useState<Activity | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchActivity = useCallback(async () => {
    if (!id) {
      setActivity(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const supabase = createClient()

      const { data, error: fetchError } = await supabase
        .from('activities')
        .select(
          `
          *,
          creator:profiles!activities_created_by_fkey(id, full_name, email),
          institution:institutions(id, name),
          department:departments(id, name),
          assigned_user:profiles!activities_assigned_to_fkey(id, full_name, email, avatar_url, designation),
          metrics:activity_metrics(*),
          impact_stats:activity_impact_stats(*),
          gallery:activity_gallery(*),
          testimonials:activity_testimonials(*)
        `
        )
        .eq('id', id)
        .single()

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          setError('Activity not found')
          setActivity(null)
          return
        }
        throw fetchError
      }

      setActivity(data as Activity)
    } catch (err) {
      console.error('[useActivity] Error:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch activity')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchActivity()
  }, [fetchActivity])

  return {
    activity,
    loading,
    error,
    refetch: fetchActivity,
  }
}

/**
 * Hook for fetching activity summaries (for dropdowns/selects)
 */
export function useActivitySummaries(publishedOnly = false) {
  const [summaries, setSummaries] = useState<ActivitySummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSummaries = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const supabase = createClient()

      let query = supabase
        .from('activities')
        .select(
          'id, title, slug, hero_image_url, status, category, progress, is_published'
        )
        .order('title', { ascending: true })

      if (publishedOnly) {
        query = query.eq('is_published', true)
      }

      const { data, error: fetchError } = await query

      if (fetchError) {
        throw fetchError
      }

      setSummaries((data as ActivitySummary[]) || [])
    } catch (err) {
      console.error('[useActivitySummaries] Error:', err)
      setError(
        err instanceof Error ? err.message : 'Failed to fetch activity summaries'
      )
    } finally {
      setLoading(false)
    }
  }, [publishedOnly])

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

/**
 * Hook for activity statistics (dashboard)
 */
export function useActivityStats() {
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    planned: 0,
    ongoing: 0,
    completed: 0,
    byCategory: {} as Record<string, number>,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const supabase = createClient()

      // Fetch all activities to calculate stats
      const { data, error: fetchError } = await supabase
        .from('activities')
        .select('status, category, is_published')

      if (fetchError) {
        throw fetchError
      }

      const activities = data || []

      // Calculate stats
      const byStatus = activities.reduce(
        (acc, activity) => {
          acc[activity.status] = (acc[activity.status] || 0) + 1
          return acc
        },
        {} as Record<string, number>
      )

      const byCategory = activities.reduce(
        (acc, activity) => {
          acc[activity.category] = (acc[activity.category] || 0) + 1
          return acc
        },
        {} as Record<string, number>
      )

      const published = activities.filter(a => a.is_published).length

      setStats({
        total: activities.length,
        published,
        planned: byStatus.planned || 0,
        ongoing: byStatus.ongoing || 0,
        completed: byStatus.completed || 0,
        byCategory,
      })
    } catch (err) {
      console.error('[useActivityStats] Error:', err)
      setError(
        err instanceof Error ? err.message : 'Failed to fetch activity statistics'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  }
}
