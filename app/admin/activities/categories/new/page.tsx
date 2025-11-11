/**
 * Create New Category Page
 * Form for creating a new activity category
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { usePermissions } from '@/lib/permissions';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CategoryForm } from '../_components/category-form';

export default function NewCategoryPage() {
  const router = useRouter();
  const { hasPermission, loading } = usePermissions();

  const canCreate = hasPermission('activities', 'create');

  useEffect(() => {
    if (!loading && !canCreate) {
      router.push('/admin/activities/categories');
    }
  }, [canCreate, loading, router]);

  if (loading) {
    return (
      <div className='p-6'>
        <Skeleton className='h-12 w-64 mb-6' />
        <Skeleton className='h-96' />
      </div>
    );
  }

  if (!canCreate) {
    return null;
  }

  return (
    <div className='p-2 max-w-9xl mx-auto space-y-6'>
      {/* Header */}
      <div className='flex items-center gap-4'>
        <Button variant='outline' size='icon' onClick={() => router.back()}>
          <ArrowLeft className='h-4 w-4' />
        </Button>
        <div>
          <h1 className='text-3xl font-bold'>Create New Category</h1>
          <p className='text-muted-foreground mt-1'>
            Add a new activity category
          </p>
        </div>
      </div>

      {/* Form */}
      <CategoryForm />
    </div>
  );
}
