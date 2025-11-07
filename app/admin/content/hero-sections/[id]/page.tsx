// =====================================================
// HERO SECTION DETAIL PAGE
// =====================================================
// Purpose: View hero section details
// Module: content/hero-sections
// Layer: Pages (Routes)
// =====================================================

'use client';

import { useRouter } from 'next/navigation';
import { useHeroSection } from '@/hooks/content/use-hero-sections';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, Edit, Loader2, Power, Copy, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { HeroSectionService } from '@/lib/services/content/hero-section-service';
import { toast } from 'sonner';
import { useState, use } from 'react';

interface HeroSectionDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function HeroSectionDetailPage({ params }: HeroSectionDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { heroSection, loading, error, refetch } = useHeroSection(id);
  const [actionLoading, setActionLoading] = useState(false);

  const handleToggleActive = async () => {
    if (!heroSection) return;

    try {
      setActionLoading(true);
      await HeroSectionService.toggleActiveStatus(
        heroSection.id,
        !heroSection.is_active
      );

      toast.success(
        heroSection.is_active
          ? 'Hero section deactivated'
          : 'Hero section activated'
      );

      refetch();
    } catch (error) {
      console.error('[detail] Toggle error:', error);
      toast.error('Failed to toggle hero section status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDuplicate = async () => {
    if (!heroSection) return;

    try {
      setActionLoading(true);
      const duplicated = await HeroSectionService.duplicateHeroSection(
        heroSection.id
      );

      toast.success('Hero section duplicated successfully');
      router.push(`/admin/content/hero-sections/${duplicated.id}/edit`);
    } catch (error) {
      console.error('[detail] Duplicate error:', error);
      toast.error('Failed to duplicate hero section');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!heroSection) return;

    if (!confirm('Are you sure you want to delete this hero section? This action cannot be undone.')) {
      return;
    }

    try {
      setActionLoading(true);
      await HeroSectionService.deleteHeroSection(heroSection.id);

      toast.success('Hero section deleted successfully');
      router.push('/admin/content/hero-sections');
    } catch (error) {
      console.error('[detail] Delete error:', error);
      toast.error('Failed to delete hero section');
    } finally {
      setActionLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>Failed to load hero section</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{error}</p>
            <Button
              onClick={() => router.push('/admin/content/hero-sections')}
              className="mt-4"
            >
              Back to Hero Sections
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Not found state
  if (!heroSection) {
    return (
      <div className="space-y-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Not Found</CardTitle>
            <CardDescription>Hero section not found</CardDescription>
          </CardHeader>
          <CardContent>
            <p>The hero section you&apos;re looking for doesn&apos;t exist.</p>
            <Button
              onClick={() => router.push('/admin/content/hero-sections')}
              className="mt-4"
            >
              Back to Hero Sections
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">{heroSection.title}</h1>
              <Badge variant={heroSection.is_active ? 'default' : 'secondary'}>
                {heroSection.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <p className="text-muted-foreground">Hero section details</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleToggleActive}
            disabled={actionLoading}
          >
            <Power className="mr-2 h-4 w-4" />
            {heroSection.is_active ? 'Deactivate' : 'Activate'}
          </Button>
          <Button
            variant="outline"
            onClick={handleDuplicate}
            disabled={actionLoading}
          >
            <Copy className="mr-2 h-4 w-4" />
            Duplicate
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push(`/admin/content/hero-sections/${heroSection.id}/edit`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={actionLoading}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Content Card */}
          <Card>
            <CardHeader>
              <CardTitle>Main Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Title</label>
                <p className="text-lg font-semibold">{heroSection.title}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Tagline</label>
                <p className="text-base">{heroSection.tagline}</p>
              </div>
              {heroSection.news_ticker_text && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">News Ticker</label>
                  <p className="text-sm">{heroSection.news_ticker_text}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* CTA Buttons Card */}
          <Card>
            <CardHeader>
              <CardTitle>Call-to-Action Buttons</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Primary Button</label>
                  <p className="font-medium">{heroSection.primary_cta_text}</p>
                  <p className="text-sm text-muted-foreground">{heroSection.primary_cta_link || 'No link'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Secondary Button</label>
                  <p className="font-medium">{heroSection.secondary_cta_text}</p>
                  <p className="text-sm text-muted-foreground">{heroSection.secondary_cta_link || 'No link'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Media Assets Card */}
          <Card>
            <CardHeader>
              <CardTitle>Media Assets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Video URL</label>
                <p className="text-sm font-mono bg-muted p-2 rounded">
                  {heroSection.video_url || 'No video'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Poster Image URL</label>
                <p className="text-sm font-mono bg-muted p-2 rounded">
                  {heroSection.poster_image_url || 'No poster'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <p>
                  <Badge variant={heroSection.is_active ? 'default' : 'secondary'}>
                    {heroSection.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Display Order</label>
                <p className="text-lg font-semibold">{heroSection.display_order}</p>
              </div>
            </CardContent>
          </Card>

          {/* Metadata Card */}
          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Created</label>
                <p className="text-sm">
                  {formatDistanceToNow(new Date(heroSection.created_at), { addSuffix: true })}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                <p className="text-sm">
                  {formatDistanceToNow(new Date(heroSection.updated_at), { addSuffix: true })}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
