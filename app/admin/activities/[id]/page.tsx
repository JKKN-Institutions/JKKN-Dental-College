/**
 * Activity Detail Page
 * View complete details of an activity
 */

'use client';

import { useEffect } from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { useActivity } from '@/hooks/content/use-activities';
import { usePermissions } from '@/lib/permissions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { deleteActivity, togglePublishStatus } from '@/app/actions/activities';
import Image from 'next/image';

export default function ActivityDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { hasPermission, profile, loading: permissionsLoading } = usePermissions();
  const { activity, loading, error, refetch } = useActivity(id);

  // Check if user can edit this specific activity
  const hasUpdatePermission = hasPermission('activities', 'update');
  const canUpdate = activity && profile ? (
    // User is assigned to this activity - can always edit
    activity.assigned_to === profile.id ||
    // Super admin with update permission can edit any activity
    (profile.role_type === 'super_admin' && hasUpdatePermission) ||
    // Regular admin with update permission can edit activities from their institution
    (hasUpdatePermission && (activity.institution_id === profile.institution_id || activity.institution_id === null))
  ) : false;

  // Delete permission remains admin-only (no assignment override)
  const canDelete = hasPermission('activities', 'delete') && (
    profile?.role_type === 'super_admin' ||
    (activity && (activity.institution_id === profile?.institution_id || activity.institution_id === null))
  );

  useEffect(() => {
    if (!permissionsLoading && !hasPermission('activities', 'view')) {
      router.push('/admin/activities');
    }
  }, [hasPermission, permissionsLoading, router]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this activity?')) {
      return;
    }

    const result = await deleteActivity(id);

    if (result.success) {
      toast.success('Activity deleted successfully');
      router.push('/admin/activities');
    } else {
      toast.error(result.message || 'Failed to delete activity');
    }
  };

  const handleTogglePublish = async () => {
    if (!activity) return;

    const result = await togglePublishStatus(id, !activity.is_published);

    if (result.success) {
      toast.success(
        `Activity ${
          activity.is_published ? 'unpublished' : 'published'
        } successfully`
      );
      refetch();
    } else {
      toast.error(result.message || 'Failed to update publish status');
    }
  };

  if (loading || permissionsLoading) {
    return (
      <div className='p-6 max-w-9xl mx-auto'>
        <Skeleton className='h-12 w-64 mb-6' />
        <Skeleton className='h-96' />
      </div>
    );
  }

  if (error || !activity) {
    return (
      <div className='p-6 max-w-9xl mx-auto'>
        <Card className='p-8 text-center'>
          <p className='text-destructive'>{error || 'Activity not found'}</p>
          <Button
            onClick={() => router.push('/admin/activities')}
            className='mt-4'
          >
            Back to Activities
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className='p-2 max-w-9xl mx-auto space-y-6'>
      {/* Header */}
      <div className='flex items-start justify-between gap-4'>
        <div className='flex items-center gap-4 flex-1'>
          <Button variant='outline' size='icon' onClick={() => router.back()}>
            <ArrowLeft className='h-4 w-4' />
          </Button>
          <div className='flex-1'>
            <h1 className='text-3xl font-bold'>{activity.title}</h1>
            <p className='text-muted-foreground mt-1'>{activity.slug}</p>
          </div>
        </div>

        {/* Actions */}
        <div className='flex items-center gap-2'>
          {canUpdate && (
            <>
              <Button variant='outline' onClick={handleTogglePublish}>
                {activity.is_published ? (
                  <>
                    <EyeOff className='h-4 w-4 mr-2' />
                    Unpublish
                  </>
                ) : (
                  <>
                    <Eye className='h-4 w-4 mr-2' />
                    Publish
                  </>
                )}
              </Button>
              <Button
                variant='outline'
                onClick={() => router.push(`/admin/activities/${id}/edit`)}
              >
                <Edit className='h-4 w-4 mr-2' />
                Edit
              </Button>
            </>
          )}
          {canDelete && (
            <Button variant='destructive' onClick={handleDelete}>
              <Trash2 className='h-4 w-4 mr-2' />
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* Status Badges */}
      <div className='flex items-center gap-2 flex-wrap'>
        <Badge variant={activity.is_published ? 'default' : 'secondary'}>
          {activity.is_published ? 'Published' : 'Draft'}
        </Badge>
        <Badge variant='outline'>{activity.status}</Badge>
        <Badge variant='outline'>{activity.category}</Badge>
        <Badge variant='outline'>{activity.progress}% Complete</Badge>
      </div>

      {/* Hero Image */}
      <Card>
        <CardContent className='p-0'>
          <div className='aspect-video bg-muted'>
            <Image
              src={activity.hero_image_url}
              alt={activity.title}
              className='w-full h-full object-cover'
              width={1000}
              height={1000}
            />
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='whitespace-pre-wrap'>{activity.description}</p>
        </CardContent>
      </Card>

      {/* Vision */}
      {activity.vision_text && (
        <Card>
          <CardHeader>
            <CardTitle>Vision</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='whitespace-pre-wrap'>{activity.vision_text}</p>
          </CardContent>
        </Card>
      )}

      {/* Metrics */}
      {activity.metrics && activity.metrics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              {activity.metrics.map((metric) => (
                <div
                  key={metric.id}
                  className='flex justify-between p-3 bg-muted rounded'
                >
                  <span className='font-medium'>{metric.metric_key}</span>
                  <span>{metric.metric_value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Impact Stats */}
      {activity.impact_stats && activity.impact_stats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Impact Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
              {activity.impact_stats.map((stat) => (
                <div key={stat.id} className='p-4 bg-muted rounded text-center'>
                  <div className='text-2xl font-bold'>{stat.value}</div>
                  <div className='text-sm text-muted-foreground mt-1'>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gallery */}
      {activity.gallery && activity.gallery.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Gallery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
              {activity.gallery.map((image) => (
                <div key={image.id} className='space-y-2'>
                  <div className='aspect-video bg-muted rounded overflow-hidden'>
                    <Image
                      src={image.image_url}
                      alt={image.alt_text || image.caption || 'Gallery image'}
                      className='w-full h-full object-cover'
                      width={300}
                      height={300}
                    />
                  </div>
                  {image.caption && (
                    <p className='text-sm text-muted-foreground'>
                      {image.caption}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Testimonials */}
      {activity.testimonials && activity.testimonials.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Testimonials</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {activity.testimonials.map((testimonial) => (
              <div key={testimonial.id} className='p-4 bg-muted rounded'>
                <p className='italic mb-3'>"{testimonial.content}"</p>
                <div className='flex items-center gap-3'>
                  {testimonial.author_avatar_url && (
                    <Image
                      src={testimonial.author_avatar_url}
                      alt={testimonial.author_name}
                      className='w-10 h-10 rounded-full object-cover'
                      width={40}
                      height={40}
                    />
                  )}
                  <div>
                    <div className='font-medium'>{testimonial.author_name}</div>
                    {testimonial.author_role && (
                      <div className='text-sm text-muted-foreground'>
                        {testimonial.author_role}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* SEO */}
      <Card>
        <CardHeader>
          <CardTitle>SEO Information</CardTitle>
        </CardHeader>
        <CardContent className='space-y-3'>
          {activity.meta_title && (
            <div>
              <div className='text-sm font-medium'>Meta Title</div>
              <div className='text-muted-foreground'>{activity.meta_title}</div>
            </div>
          )}
          {activity.meta_description && (
            <div>
              <div className='text-sm font-medium'>Meta Description</div>
              <div className='text-muted-foreground'>
                {activity.meta_description}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
