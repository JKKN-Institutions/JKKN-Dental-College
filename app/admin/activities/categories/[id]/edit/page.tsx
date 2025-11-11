/**
 * Edit Category Page
 * Form for editing an existing activity category
 */

'use client';

import { useEffect } from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useCategory } from '@/hooks/content/use-activity-categories';
import { usePermissions } from '@/lib/permissions';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { CategoryForm } from '../../_components/category-form';

export default function EditCategoryPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { hasPermission, loading: permissionsLoading } = usePermissions();
  const { category, loading, error } = useCategory(id);

  const canUpdate = hasPermission('activities', 'update');

  useEffect(() => {
    if (!permissionsLoading && !canUpdate) {
      router.push('/admin/activities/categories');
    }
  }, [canUpdate, permissionsLoading, router]);

  if (loading || permissionsLoading) {
    return (
      <div className='p-6 max-w-3xl mx-auto'>
        <Skeleton className='h-12 w-64 mb-6' />
        <Skeleton className='h-96' />
      </div>
    );
  }

  if (!canUpdate) {
    return null;
  }

  if (error || !category) {
    return (
      <div className='p-6 max-w-3xl mx-auto'>
        <Card className='p-8 text-center'>
          <p className='text-destructive'>{error || 'Category not found'}</p>
          <Button
            onClick={() => router.push('/admin/activities/categories')}
            className='mt-4'
          >
            Back to Categories
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className='p-2 max-w-9xl mx-auto space-y-6'>
      {/* Header */}
      <div className='flex items-center gap-4'>
        <Button variant='outline' size='icon' onClick={() => router.back()}>
          <ArrowLeft className='h-4 w-4' />
        </Button>
        <div>
          <h1 className='text-3xl font-bold'>Edit Category</h1>
          <p className='text-muted-foreground mt-1'>Update {category.name}</p>
        </div>
      </div>

      {/* Form */}
      <CategoryForm initialData={category} />
    </div>
  );
}
