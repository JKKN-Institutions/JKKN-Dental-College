// =====================================================
// EDIT HERO SECTION PAGE
// =====================================================
// Purpose: Form page for editing existing hero section
// Module: content/hero-sections
// Layer: Pages (Routes)
// =====================================================

'use client';

import { useRouter } from 'next/navigation';
import { useHeroSection } from '@/hooks/content/use-hero-sections';
import { HeroSectionForm } from '../../_components/hero-section-form';
import { HeroSectionService } from '@/lib/services/content/hero-section-service';
import { HeroSectionFormData } from '../../_components/data-table-schema';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { use } from 'react';

interface EditHeroSectionPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditHeroSectionPage({ params }: EditHeroSectionPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { heroSection, loading, error } = useHeroSection(id);

  const handleSubmit = async (data: HeroSectionFormData) => {
    try {
      console.log('[pages/hero-sections/edit] Updating hero section:', id);

      await HeroSectionService.updateHeroSection({
        id: id,
        title: data.title,
        tagline: data.tagline,
        news_ticker_text: data.news_ticker_text || undefined,
        primary_cta_text: data.primary_cta_text,
        primary_cta_link: data.primary_cta_link || undefined,
        secondary_cta_text: data.secondary_cta_text,
        secondary_cta_link: data.secondary_cta_link || undefined,
        video_url: data.video_url || undefined,
        poster_image_url: data.poster_image_url || undefined,
        is_active: data.is_active,
        display_order: data.display_order,
      });

      toast.success('Hero section updated successfully');
      router.push('/admin/content/hero-sections');
      router.refresh();
    } catch (error) {
      console.error('[pages/hero-sections/edit] Error:', error);
      toast.error('Failed to update hero section. Please try again.');
      throw error; // Re-throw to keep form in submitting state
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
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Hero Section</h1>
          <p className="text-muted-foreground">
            Update the hero section content for your website
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl">
        <HeroSectionForm
          heroSection={heroSection}
          onSubmit={handleSubmit}
          submitLabel="Update Hero Section"
        />
      </div>
    </div>
  );
}
