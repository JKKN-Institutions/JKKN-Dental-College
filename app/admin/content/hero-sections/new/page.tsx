// =====================================================
// CREATE HERO SECTION PAGE
// =====================================================
// Purpose: Form page for creating new hero section
// Module: content/hero-sections
// Layer: Pages (Routes)
// =====================================================

'use client';

import { useRouter } from 'next/navigation';
import { HeroSectionForm } from '../_components/hero-section-form';
import { HeroSectionService } from '@/lib/services/content/hero-section-service';
import { HeroSectionFormData } from '../_components/data-table-schema';
import { toast } from 'sonner';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NewHeroSectionPage() {
  const router = useRouter();

  const handleSubmit = async (data: HeroSectionFormData) => {
    try {
      console.log('[pages/hero-sections/new] Creating hero section:', data);

      await HeroSectionService.createHeroSection({
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

      toast.success('Hero section created successfully');
      router.push('/admin/content/hero-sections');
      router.refresh();
    } catch (error) {
      console.error('[pages/hero-sections/new] Error:', error);
      toast.error('Failed to create hero section. Please try again.');
      throw error; // Re-throw to keep form in submitting state
    }
  };

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
          <h1 className="text-3xl font-bold">Create Hero Section</h1>
          <p className="text-muted-foreground">
            Add a new hero section for your website homepage
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl">
        <HeroSectionForm
          onSubmit={handleSubmit}
          submitLabel="Create Hero Section"
        />
      </div>
    </div>
  );
}
