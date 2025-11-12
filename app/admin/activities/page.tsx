/**
 * Activities List Page
 * Main admin page for managing JKKN Centenary Activities
 */

'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Search, Filter, Grid3x3, List, Download } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useActivities } from '@/hooks/content/use-activities'
import { useCategorySummaries } from '@/hooks/content/use-activity-categories'
import { usePermissions, isSuperAdmin } from '@/lib/permissions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import type { ActivityFilters } from '@/types/activity'
import { useDebounce } from '@/hooks/useDebounce'

export default function ActivitiesPage() {
  const router = useRouter()
  const { hasPermission, profile, loading: permissionsLoading } = usePermissions()

  // Fetch active categories for filter
  const { summaries: categories } = useCategorySummaries(true)

  // Assignment data for filters
  const [institutions, setInstitutions] = useState<Array<{ id: string; name: string }>>([])
  const [departments, setDepartments] = useState<Array<{ id: string; name: string }>>([])

  // View mode
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Filters
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [publishedFilter, setPublishedFilter] = useState<string>('all')
  const [institutionFilter, setInstitutionFilter] = useState<string>('all')
  const [departmentFilter, setDepartmentFilter] = useState<string>('all')
  const [assignedToFilter, setAssignedToFilter] = useState<string>('all')
  const [pageSize, setPageSize] = useState(12)

  // Debounce search
  const debouncedSearch = useDebounce(search, 500)

  // Fetch institutions (for super admins only)
  useEffect(() => {
    if (!profile || !isSuperAdmin(profile)) return

    const fetchInstitutions = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('institutions')
        .select('id, name')
        .order('name', { ascending: true })

      setInstitutions(data || [])
    }

    fetchInstitutions()
  }, [profile])

  // Fetch departments (filtered by institution if selected)
  useEffect(() => {
    const fetchDepartments = async () => {
      const supabase = createClient()

      let query = supabase
        .from('departments')
        .select('id, name, institution_id')
        .order('name', { ascending: true })

      // Filter by institution
      const selectedInstitution =
        isSuperAdmin(profile) && institutionFilter !== 'all'
          ? institutionFilter
          : profile?.institution_id

      if (selectedInstitution) {
        query = query.eq('institution_id', selectedInstitution)
      }

      const { data } = await query
      setDepartments(data || [])
    }

    if (profile) {
      fetchDepartments()
    }
  }, [profile, institutionFilter])

  // Build filters object - memoized to prevent infinite re-renders
  const filters: ActivityFilters = useMemo(() => ({
    search: debouncedSearch || undefined,
    status:
      statusFilter !== 'all'
        ? (statusFilter as 'planned' | 'ongoing' | 'completed')
        : undefined,
    category:
      categoryFilter !== 'all'
        ? categoryFilter // Dynamic - uses any category slug from database
        : undefined,
    is_published:
      publishedFilter === 'published'
        ? true
        : publishedFilter === 'draft'
        ? false
        : undefined,
    institution_id: institutionFilter !== 'all' ? institutionFilter : undefined,
    department_id: departmentFilter !== 'all' ? departmentFilter : undefined,
    assigned_to:
      assignedToFilter === 'me'
        ? 'me'
        : assignedToFilter === 'unassigned'
        ? 'unassigned'
        : assignedToFilter !== 'all'
        ? assignedToFilter
        : undefined,
  }), [
    debouncedSearch,
    statusFilter,
    categoryFilter,
    publishedFilter,
    institutionFilter,
    departmentFilter,
    assignedToFilter,
  ])

  // Fetch activities
  const {
    activities,
    loading,
    error,
    total,
    page,
    pageSize: currentPageSize,
    totalPages,
    setPage,
    setPageSize: updatePageSize,
    refetch,
  } = useActivities(filters, pageSize)

  // Permission checks
  const canCreate = hasPermission('activities', 'create')
  const canView = hasPermission('activities', 'view')

  // Redirect if no permission
  useEffect(() => {
    if (!permissionsLoading && !canView) {
      router.push('/admin/dashboard')
    }
  }, [canView, permissionsLoading, router])

  // Update page size
  useEffect(() => {
    updatePageSize(pageSize)
  }, [pageSize, updatePageSize])

  if (permissionsLoading) {
    return (
      <div className="p-6">
        <Skeleton className="h-12 w-64 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    )
  }

  if (!canView) {
    return null
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Activities</h1>
          <p className="text-muted-foreground mt-1">
            Manage JKKN Centenary Activities
          </p>
        </div>
        {canCreate && (
          <Button onClick={() => router.push('/admin/activities/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Activity
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Activities</div>
          <div className="text-2xl font-bold mt-1">{total}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Published</div>
          <div className="text-2xl font-bold mt-1">
            {activities.filter(a => a.is_published).length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Ongoing</div>
          <div className="text-2xl font-bold mt-1">
            {activities.filter(a => a.status === 'ongoing').length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Completed</div>
          <div className="text-2xl font-bold mt-1">
            {activities.filter(a => a.status === 'completed').length}
          </div>
        </Card>
      </div>

      {/* Filters Bar */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search activities..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full lg:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="planned">Planned</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full lg:w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.slug}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Published Filter */}
          <Select value={publishedFilter} onValueChange={setPublishedFilter}>
            <SelectTrigger className="w-full lg:w-40">
              <SelectValue placeholder="Published" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>

          {/* Institution Filter (Super Admin Only) */}
          {isSuperAdmin(profile) && (
            <Select value={institutionFilter} onValueChange={setInstitutionFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Institution" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Institutions</SelectItem>
                {institutions.map((institution) => (
                  <SelectItem key={institution.id} value={institution.id}>
                    {institution.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Department Filter */}
          <Select
            value={departmentFilter}
            onValueChange={setDepartmentFilter}
            disabled={departments.length === 0}
          >
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((department) => (
                <SelectItem key={department.id} value={department.id}>
                  {department.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Assignment Filter */}
          <Select value={assignedToFilter} onValueChange={setAssignedToFilter}>
            <SelectTrigger className="w-full lg:w-40">
              <SelectValue placeholder="Assignment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Activities</SelectItem>
              <SelectItem value="me">Assigned to Me</SelectItem>
              <SelectItem value="unassigned">Unassigned</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Active Filters */}
        {(debouncedSearch ||
          statusFilter !== 'all' ||
          categoryFilter !== 'all' ||
          publishedFilter !== 'all' ||
          institutionFilter !== 'all' ||
          departmentFilter !== 'all' ||
          assignedToFilter !== 'all') && (
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {debouncedSearch && (
              <Badge variant="secondary">Search: {debouncedSearch}</Badge>
            )}
            {statusFilter !== 'all' && (
              <Badge variant="secondary">Status: {statusFilter}</Badge>
            )}
            {categoryFilter !== 'all' && (
              <Badge variant="secondary">
                Category: {categories.find(c => c.slug === categoryFilter)?.name || categoryFilter}
              </Badge>
            )}
            {publishedFilter !== 'all' && (
              <Badge variant="secondary">
                {publishedFilter === 'published' ? 'Published' : 'Draft'}
              </Badge>
            )}
            {institutionFilter !== 'all' && (
              <Badge variant="secondary">
                Institution: {institutions.find(i => i.id === institutionFilter)?.name || institutionFilter}
              </Badge>
            )}
            {departmentFilter !== 'all' && (
              <Badge variant="secondary">
                Department: {departments.find(d => d.id === departmentFilter)?.name || departmentFilter}
              </Badge>
            )}
            {assignedToFilter !== 'all' && (
              <Badge variant="secondary">
                {assignedToFilter === 'me'
                  ? 'Assigned to Me'
                  : assignedToFilter === 'unassigned'
                  ? 'Unassigned'
                  : 'Assigned'}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearch('')
                setStatusFilter('all')
                setCategoryFilter('all')
                setPublishedFilter('all')
                setInstitutionFilter('all')
                setDepartmentFilter('all')
                setAssignedToFilter('all')
              }}
            >
              Clear all
            </Button>
          </div>
        )}
      </Card>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(pageSize)].map((_, i) => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      ) : error ? (
        <Card className="p-8 text-center">
          <p className="text-destructive">{error}</p>
          <Button onClick={refetch} className="mt-4">
            Try Again
          </Button>
        </Card>
      ) : activities.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No activities found</p>
          {canCreate && (
            <Button
              onClick={() => router.push('/admin/activities/new')}
              className="mt-4"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Activity
            </Button>
          )}
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activities.map(activity => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {activities.map(activity => (
            <ActivityListItem key={activity.id} activity={activity} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              Showing {(page - 1) * currentPageSize + 1} to{' '}
              {Math.min(page * currentPageSize, total)} of {total} activities
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const pageNum =
                    totalPages <= 5
                      ? i + 1
                      : page <= 3
                      ? i + 1
                      : page >= totalPages - 2
                      ? totalPages - 4 + i
                      : page - 2 + i

                  return (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
            <Select
              value={pageSize.toString()}
              onValueChange={v => setPageSize(Number(v))}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12">12 per page</SelectItem>
                <SelectItem value="24">24 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
                <SelectItem value="100">100 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>
      )}
    </div>
  )
}

// Helper function to check if user can edit activity
function canEditActivity(activity: any, profile: any, hasUpdatePermission: boolean): boolean {
  if (!profile) return false

  // User is assigned to this activity - can always edit
  if (activity.assigned_to === profile.id) {
    return true
  }

  // Super admin with update permission can edit any activity
  if (profile.role_type === 'super_admin' && hasUpdatePermission) {
    return true
  }

  // Regular admin with update permission can edit activities from their institution
  if (hasUpdatePermission &&
      (activity.institution_id === profile.institution_id || activity.institution_id === null)) {
    return true
  }

  return false
}

// Activity Card Component (Grid View)
function ActivityCard({ activity }: { activity: any }) {
  const router = useRouter()
  const { hasPermission, profile } = usePermissions()

  const hasUpdatePermission = hasPermission('activities', 'update')
  const canUpdate = canEditActivity(activity, profile, hasUpdatePermission)

  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => router.push(`/admin/activities/${activity.id}`)}
    >
      {/* Hero Image */}
      <div className="aspect-video bg-muted relative">
        {activity.hero_image_url ? (
          <img
            src={activity.hero_image_url}
            alt={activity.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No image
          </div>
        )}
        {!activity.is_published && (
          <Badge className="absolute top-2 right-2" variant="secondary">
            Draft
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold line-clamp-2">{activity.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {activity.description}
          </p>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline">{activity.status}</Badge>
          <Badge variant="outline">{activity.category}</Badge>
          {activity.assigned_user && (
            <Badge variant="secondary" className="text-xs">
              Assigned: {activity.assigned_user.full_name || activity.assigned_user.email}
            </Badge>
          )}
        </div>

        {/* Progress */}
        {activity.progress > 0 && (
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{activity.progress}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${activity.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        {canUpdate && (
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={e => {
                e.stopPropagation()
                router.push(`/admin/activities/${activity.id}/edit`)
              }}
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={e => {
                e.stopPropagation()
                router.push(`/admin/activities/${activity.id}`)
              }}
            >
              View
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}

// Activity List Item Component (List View)
function ActivityListItem({ activity }: { activity: any }) {
  const router = useRouter()
  const { hasPermission, profile } = usePermissions()

  const hasUpdatePermission = hasPermission('activities', 'update')
  const canUpdate = canEditActivity(activity, profile, hasUpdatePermission)

  return (
    <Card
      className="p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => router.push(`/admin/activities/${activity.id}`)}
    >
      <div className="flex items-center gap-4">
        {/* Thumbnail */}
        <div className="w-24 h-24 bg-muted rounded overflow-hidden flex-shrink-0">
          {activity.hero_image_url ? (
            <img
              src={activity.hero_image_url}
              alt={activity.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
              No image
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{activity.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                {activity.description}
              </p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Badge variant="outline" className="text-xs">
                  {activity.status}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {activity.category}
                </Badge>
                {!activity.is_published && (
                  <Badge variant="secondary" className="text-xs">
                    Draft
                  </Badge>
                )}
                {activity.assigned_user && (
                  <Badge variant="secondary" className="text-xs">
                    Assigned: {activity.assigned_user.full_name || activity.assigned_user.email}
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">
                  {activity.progress}% complete
                </span>
              </div>
            </div>

            {/* Actions */}
            {canUpdate && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={e => {
                    e.stopPropagation()
                    router.push(`/admin/activities/${activity.id}/edit`)
                  }}
                >
                  Edit
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
