// =====================================================
// HERO SECTION FORM
// =====================================================
// Purpose: Form for managing Hero section content from Home Sections
// Allows add/edit/delete of hero items dynamically from database
// =====================================================

"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { HomeSection } from "@/types/sections";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { HiPlus, HiTrash, HiSave, HiPencil, HiEye, HiEyeOff } from "react-icons/hi";
import { toast } from "sonner";
import {
  getAllHeroSections,
  createHeroSection,
  updateHeroSection,
  deleteHeroSection,
  toggleHeroSectionStatus,
  type HeroSection as HeroSectionType,
  type HeroSectionInput,
} from "@/app/admin/content/sections/[id]/edit/_actions/hero-actions";

interface HeroSectionFormProps {
  section: HomeSection;
}

const heroItemSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  tagline: z.string().min(1, "Tagline is required").max(500),
  news_ticker_text: z.string().optional(),
  primary_cta_text: z.string().min(1, "Primary button text is required").max(50),
  primary_cta_link: z.string().optional(),
  secondary_cta_text: z.string().min(1, "Secondary button text is required").max(50),
  secondary_cta_link: z.string().optional(),
  video_url: z.string().optional(),
  poster_image_url: z.string().optional(),
  is_active: z.boolean().optional(),
  display_order: z.number().int().optional(),
});

type HeroItemFormValues = z.infer<typeof heroItemSchema>;

export function HeroSectionForm({ section }: HeroSectionFormProps) {
  const [heroItems, setHeroItems] = useState<HeroSectionType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm<HeroItemFormValues>({
    resolver: zodResolver(heroItemSchema),
    defaultValues: {
      title: "JKKN Institution",
      tagline: "Empowering Excellence, Inspiring Innovation",
      news_ticker_text: "",
      primary_cta_text: "Apply Now",
      primary_cta_link: "/admissions",
      secondary_cta_text: "Explore Campus",
      secondary_cta_link: "/campus",
      video_url: "/videos/campus-video.mp4",
      poster_image_url: "/images/campus-poster.jpg",
      is_active: false,
      display_order: 0,
    },
  });

  useEffect(() => {
    loadHeroItems();
  }, []);

  const loadHeroItems = async () => {
    setIsLoading(true);
    const result = await getAllHeroSections();
    if (result.success) {
      setHeroItems(result.data);
    } else {
      toast.error(result.error || "Failed to load hero sections");
    }
    setIsLoading(false);
  };

  const handleSubmit = async (values: HeroItemFormValues) => {
    setIsSubmitting(true);
    try {
      const input: HeroSectionInput = {
        title: values.title,
        tagline: values.tagline,
        news_ticker_text: values.news_ticker_text,
        primary_cta_text: values.primary_cta_text,
        primary_cta_link: values.primary_cta_link,
        secondary_cta_text: values.secondary_cta_text,
        secondary_cta_link: values.secondary_cta_link,
        video_url: values.video_url,
        poster_image_url: values.poster_image_url,
        is_active: values.is_active ?? false,
        display_order: values.display_order ?? 0,
      };

      let result;
      if (editingId) {
        result = await updateHeroSection(editingId, input);
        if (result.success) {
          toast.success("Hero section updated successfully!");
        }
      } else {
        result = await createHeroSection(input);
        if (result.success) {
          toast.success("Hero section created successfully!");
        }
      }

      if (!result.success) {
        toast.error(result.error || "Failed to save hero section");
        return;
      }

      form.reset({
        title: "JKKN Institution",
        tagline: "Empowering Excellence, Inspiring Innovation",
        news_ticker_text: "",
        primary_cta_text: "Apply Now",
        primary_cta_link: "/admissions",
        secondary_cta_text: "Explore Campus",
        secondary_cta_link: "/campus",
        video_url: "/videos/campus-video.mp4",
        poster_image_url: "/images/campus-poster.jpg",
        is_active: false,
        display_order: 0,
      });
      setEditingId(null);
      await loadHeroItems();
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("[HeroSectionForm] Error saving:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (hero: HeroSectionType) => {
    setEditingId(hero.id);
    form.reset({
      title: hero.title,
      tagline: hero.tagline,
      news_ticker_text: hero.news_ticker_text || "",
      primary_cta_text: hero.primary_cta_text,
      primary_cta_link: hero.primary_cta_link || "",
      secondary_cta_text: hero.secondary_cta_text,
      secondary_cta_link: hero.secondary_cta_link || "",
      video_url: hero.video_url || "",
      poster_image_url: hero.poster_image_url || "",
      is_active: hero.is_active || false,
      display_order: hero.display_order || 0,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hero section?")) {
      return;
    }

    const result = await deleteHeroSection(id);
    if (result.success) {
      toast.success("Hero section deleted successfully!");
      await loadHeroItems();
    } else {
      toast.error(result.error || "Failed to delete hero section");
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const result = await toggleHeroSectionStatus(id, !currentStatus);
    if (result.success) {
      toast.success(`Hero section ${!currentStatus ? "activated" : "deactivated"} successfully!`);
      await loadHeroItems();
    } else {
      toast.error(result.error || "Failed to toggle hero section status");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    form.reset({
      title: "JKKN Institution",
      tagline: "Empowering Excellence, Inspiring Innovation",
      news_ticker_text: "",
      primary_cta_text: "Apply Now",
      primary_cta_link: "/admissions",
      secondary_cta_text: "Explore Campus",
      secondary_cta_link: "/campus",
      video_url: "/videos/campus-video.mp4",
      poster_image_url: "/images/campus-poster.jpg",
      is_active: false,
      display_order: 0,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Section Management</CardTitle>
          <CardDescription>
            Manage hero sections for your homepage. Only one hero section can be active at a time.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Add/Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit Hero Section" : "Add New Hero Section"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Main Content */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Main Content</h3>

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="JKKN Institution" {...field} disabled={isSubmitting} />
                      </FormControl>
                      <FormDescription>Main title displayed on the hero section</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                      <FormDescription>Inspirational tagline below the title</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                        Scrolling news text. Use | to separate multiple announcements.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Call-to-Action Buttons */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Call-to-Action Buttons</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="primary_cta_text"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Button Text</FormLabel>
                        <FormControl>
                          <Input placeholder="Apply Now" {...field} disabled={isSubmitting} />
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
                        <FormLabel>Primary Button Link</FormLabel>
                        <FormControl>
                          <Input placeholder="/admissions" {...field} disabled={isSubmitting} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="secondary_cta_text"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Secondary Button Text</FormLabel>
                        <FormControl>
                          <Input placeholder="Explore Campus" {...field} disabled={isSubmitting} />
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
                        <FormLabel>Secondary Button Link</FormLabel>
                        <FormControl>
                          <Input placeholder="/campus" {...field} disabled={isSubmitting} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Media Assets */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Media Assets</h3>

                <FormField
                  control={form.control}
                  name="video_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video URL (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="/videos/campus-video.mp4"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>Path to background video</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="poster_image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Poster Image URL (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="/images/campus-poster.jpg"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>Fallback image shown while video loads</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Settings</h3>

                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active Status</FormLabel>
                        <FormDescription>
                          Only one hero section can be active. Activating this will deactivate others.
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
                          value={field.value || 0}
                          onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
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
              </div>

              {/* Form Actions */}
              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting} className="gap-2">
                  <HiSave className="h-4 w-4" />
                  {editingId ? "Update Hero Section" : "Add Hero Section"}
                </Button>
                {editingId && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelEdit}
                    disabled={isSubmitting}
                  >
                    Cancel Edit
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Existing Hero Sections List */}
      <Card>
        <CardHeader>
          <CardTitle>Existing Hero Sections ({heroItems.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading hero sections...</div>
          ) : heroItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hero sections yet. Create one above!
            </div>
          ) : (
            <div className="space-y-4">
              {heroItems.map((hero) => (
                <div
                  key={hero.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-lg">{hero.title}</h4>
                        {hero.is_active && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{hero.tagline}</p>
                      <div className="flex gap-4 text-sm text-gray-500">
                        <span>Primary CTA: {hero.primary_cta_text}</span>
                        <span>Secondary CTA: {hero.secondary_cta_text}</span>
                        <span>Order: {hero.display_order}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleStatus(hero.id, hero.is_active || false)}
                        className="gap-1"
                      >
                        {hero.is_active ? (
                          <>
                            <HiEyeOff className="h-4 w-4" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <HiEye className="h-4 w-4" />
                            Activate
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(hero)}
                        className="gap-1"
                      >
                        <HiPencil className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(hero.id)}
                        className="gap-1"
                      >
                        <HiTrash className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
