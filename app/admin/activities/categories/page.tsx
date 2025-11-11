/**
 * Activity Categories List Page
 * Manage activity categories dynamically
 */

'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Search, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import { useCategories } from '@/hooks/content/use-activity-categories'
import { usePermissions } from '@/lib/permissions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import toast from 'react-hot-toast'
import { deleteCategory, toggleCategoryStatus } from '@/app/actions/activity-categories'
import type { CategoryFilters } from '@/types/activity-category'

export default function ActivityCategoriesPage() {
  const router = useRouter()
  const { hasPermission, loading: permissionsLoading } = usePermissions()

  // Filters
  const [search, setSearch] = useState('')

  // Delete confirmation state
  const [categoryToDelete, setCategoryToDelete] = useState<{ id: string; name: string } | null>(null)

  // Build filters object - memoized to prevent infinite re-renders
  const filters: CategoryFilters = useMemo(() => ({
    search: search || undefined,
  }), [search])

  // Fetch categories
  const {
    categories,
    loading,
    error,
    refetch,
  } = useCategories(filters)

  // Permission checks
  const canCreate = hasPermission('activities', 'create')
  const canUpdate = hasPermission('activities', 'update')
  const canDelete = hasPermission('activities', 'delete')
  const canView = hasPermission('activities', 'view')

  // Redirect if no permission
  useEffect(() => {
    if (!permissionsLoading && !canView) {
      router.push('/admin/dashboard')
    }
  }, [canView, permissionsLoading, router])

  const handleDeleteClick = (id: string, name: string) => {
    setCategoryToDelete({ id, name })
  }

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return

    const result = await deleteCategory(categoryToDelete.id)

    if (result.success) {
      toast.success('Category deleted successfully')
      refetch()
    } else {
      toast.error(result.message || 'Failed to delete category')
    }

    setCategoryToDelete(null)
  }

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const result = await toggleCategoryStatus(id, !currentStatus)

    if (result.success) {
      toast.success(`Category ${currentStatus ? 'deactivated' : 'activated'} successfully`)
      refetch()
    } else {
      toast.error(result.message || 'Failed to update category status')
    }
  }

  if (permissionsLoading) {
    return (
      <div className="p-6">
        <Skeleton className="h-12 w-64 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-40" />
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
          <h1 className="text-3xl font-bold">Activity Categories</h1>
          <p className="text-muted-foreground mt-1">
            Manage dynamic categories for activities
          </p>
        </div>
        {canCreate && (
          <Button onClick={() => router.push('/admin/activities/categories/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Category
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Categories</div>
          <div className="text-2xl font-bold mt-1">{categories.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Active</div>
          <div className="text-2xl font-bold mt-1">
            {categories.filter(c => c.is_active).length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Inactive</div>
          <div className="text-2xl font-bold mt-1">
            {categories.filter(c => !c.is_active).length}
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      </Card>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      ) : error ? (
        <Card className="p-8 text-center">
          <p className="text-destructive">{error}</p>
          <Button onClick={refetch} className="mt-4">
            Try Again
          </Button>
        </Card>
      ) : categories.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No categories found</p>
          {canCreate && (
            <Button
              onClick={() => router.push('/admin/activities/categories/new')}
              className="mt-4"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Category
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <Card key={category.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{category.name}</h3>
                  <Badge variant={category.is_active ? 'default' : 'secondary'} className="mt-1">
                    {category.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>

              {category.description && (
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {category.description}
                </p>
              )}

              <div className="flex items-center gap-2">
                {canUpdate && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleStatus(category.id, category.is_active)}
                    >
                      {category.is_active ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/admin/activities/categories/${category.id}/edit`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </>
                )}
                {canDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteClick(category.id, category.name)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!categoryToDelete} onOpenChange={(open) => !open && setCategoryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-semibold">{categoryToDelete?.name}</span>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
