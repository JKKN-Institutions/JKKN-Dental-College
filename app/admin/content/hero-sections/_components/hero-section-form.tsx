// =====================================================
// HERO SECTION FORM
// =====================================================
// Purpose: Create/Edit form for hero sections
// Module: content/hero-sections
// Layer: Components (Form)
// =====================================================

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { heroSectionSchema, type HeroSectionFormData } from './data-table-schema';
import { HeroSection } from '@/types/hero-section';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface HeroSectionFormProps {
  heroSection?: HeroSection | null;
  onSubmit: (data: HeroSectionFormData) => Promise<void>;
  submitLabel?: string;
}

export function HeroSectionForm({
  heroSection,
  onSubmit,
  submitLabel = 'Create Hero Section',
}: HeroSectionFormProps) {
  const form = useForm({
    resolver: zodResolver(heroSectionSchema),
    defaultValues: {
      title: heroSection?.title || 'JKKN Institution',
      tagline: heroSection?.tagline || 'Empowering Excellence, Inspiring Innovation',
      news_ticker_text: heroSection?.news_ticker_text || '',
      primary_cta_text: heroSection?.primary_cta_text || 'Apply Now',
      primary_cta_link: heroSection?.primary_cta_link || '/admissions',
      secondary_cta_text: heroSection?.secondary_cta_text || 'Explore Campus',
      secondary_cta_link: heroSection?.secondary_cta_link || '/campus',
      video_url: heroSection?.video_url || '/videos/campus-video.mp4',
      poster_image_url: heroSection?.poster_image_url || '/images/campus-poster.jpg',
      is_active: heroSection?.is_active ?? false,
      display_order: heroSection?.display_order ?? 0,
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Main Content Card */}
        <Card>
          <CardHeader>
            <CardTitle>Main Content</CardTitle>
            <CardDescription>
              Primary text content displayed on the hero section
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="JKKN Institution"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    Main title displayed at the top of the hero section
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tagline */}
            <FormField
              control={form.control}
              name="tagline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tagline</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Empowering Excellence, Inspiring Innovation"
                      rows={3}
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    Inspirational tagline displayed below the title
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* News Ticker */}
            <FormField
              control={form.control}
              name="news_ticker_text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>News Ticker Text (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Breaking News: Admissions Open..."
                      rows={2}
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    Scrolling news text at the top. Use | to separate multiple announcements.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Call-to-Action Buttons Card */}
        <Card>
          <CardHeader>
            <CardTitle>Call-to-Action Buttons</CardTitle>
            <CardDescription>
              Configure the primary and secondary action buttons
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Primary CTA */}
            <div className="space-y-4">
              <h4 className="font-medium">Primary Button</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="primary_cta_text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Button Text</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Apply Now"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="primary_cta_link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Button Link</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="/admissions"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Secondary CTA */}
            <div className="space-y-4">
              <h4 className="font-medium">Secondary Button</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="secondary_cta_text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Button Text</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Explore Campus"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="secondary_cta_link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Button Link</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="/campus"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Media Assets Card */}
        <Card>
          <CardHeader>
            <CardTitle>Media Assets</CardTitle>
            <CardDescription>
              Background video and poster image URLs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Video URL */}
            <FormField
              control={form.control}
              name="video_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="/videos/campus-video.mp4"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    Path to video file in public folder or full URL
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Poster Image URL */}
            <FormField
              control={form.control}
              name="poster_image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Poster Image URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="/images/campus-poster.jpg"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    Fallback image shown while video loads
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>
              Visibility and ordering configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Is Active */}
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active Status</FormLabel>
                    <FormDescription>
                      Only one hero section can be active at a time. Activating this will deactivate others.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Display Order */}
            <FormField
              control={form.control}
              name="display_order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Order</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      value={typeof field.value === 'number' ? field.value : 0}
                      onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    Order in which this hero appears (lower numbers first)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
