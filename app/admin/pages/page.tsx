import { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { PagesDataTable } from '@/components/admin/pages/pages-data-table'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata = {
  title: 'Page Builder | Admin',
  description: 'Manage custom pages',
}

function PagesListSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  )
}

export default function PagesPage() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Page Builder</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage custom pages with drag-and-drop blocks
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/pages/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Page
          </Link>
        </Button>
      </div>

      {/* Pages Table */}
      <Suspense fallback={<PagesListSkeleton />}>
        <PagesDataTable />
      </Suspense>
    </div>
  )
}
