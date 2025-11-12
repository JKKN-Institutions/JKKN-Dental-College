// =====================================================
// PAGE FORM COMPONENT
// =====================================================
// Purpose: Form for creating and editing pages
// Module: pages
// Layer: Components
// =====================================================

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Page, CreatePageDto, UpdatePageDto } from "@/types/pages";
import { usePageMutations } from "@/hooks/pages/use-pages";
import { PagesService } from "@/lib/services/pages/pages-service";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { HiSave, HiX, HiEye } from "react-icons/hi";

const pageFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  excerpt: z.string().max(500, "Excerpt is too long").optional(),
  content_html: z.string().optional(),
  template_type: z.enum(["default", "full-width", "sidebar", "landing"]),
  is_published: z.boolean(),
  meta_title: z.string().max(60, "Meta title should be 60 characters or less").optional(),
  meta_description: z.string().max(160, "Meta description should be 160 characters or less").optional(),
});

type PageFormValues = z.infer<typeof pageFormSchema>;

interface PageFormProps {
  page?: Page | null;
  mode: "create" | "edit";
}

export function PageForm({ page, mode }: PageFormProps) {
  const router = useRouter();
  const { createPage, updatePage } = usePageMutations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slugError, setSlugError] = useState<string | null>(null);

  const form = useForm<PageFormValues>({
    resolver: zodResolver(pageFormSchema),
    defaultValues: {
      title: page?.title || "",
      slug: page?.slug || "",
      excerpt: page?.excerpt || "",
      content_html: (page?.content as any)?.html || "",
      template_type: page?.template_type || "default",
      is_published: page?.is_published || false,
      meta_title: page?.meta_title || "",
      meta_description: page?.meta_description || "",
    },
  });

  // Auto-generate slug from title
  const watchTitle = form.watch("title");
  useEffect(() => {
    if (mode === "create" && watchTitle) {
      const slug = watchTitle
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      form.setValue("slug", slug);
    }
  }, [watchTitle, mode, form]);

  // Check slug availability
  const handleSlugBlur = async () => {
    const slug = form.getValues("slug");
    if (!slug) return;

    const isAvailable = await PagesService.isSlugAvailable(
      slug,
      page?.id
    );

    if (!isAvailable) {
      setSlugError("This slug is already in use");
      form.setError("slug", { message: "This slug is already in use" });
    } else {
      setSlugError(null);
      form.clearErrors("slug");
    }
  };

  const onSubmit = async (values: PageFormValues) => {
    if (slugError) {
      toast.error("Please fix the slug error before submitting");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare page content
      const content = {
        html: values.content_html || "",
      };

      if (mode === "create") {
        const dto: CreatePageDto = {
          title: values.title,
          slug: values.slug,
          excerpt: values.excerpt,
          content,
          template_type: values.template_type,
          is_published: values.is_published,
          meta_title: values.meta_title,
          meta_description: values.meta_description,
        };

        const newPage = await createPage(dto);
        if (newPage) {
          toast.success("Page created successfully");
          router.push("/admin/content/pages");
          router.refresh();
        } else {
          toast.error("Failed to create page");
        }
      } else if (page) {
        const dto: UpdatePageDto = {
          id: page.id,
          title: values.title,
          slug: values.slug,
          excerpt: values.excerpt,
          content,
          template_type: values.template_type,
          is_published: values.is_published,
          meta_title: values.meta_title,
          meta_description: values.meta_description,
        };

        const updatedPage = await updatePage(dto);
        if (updatedPage) {
          toast.success("Page updated successfully");
          router.push("/admin/content/pages");
          router.refresh();
        } else {
          toast.error("Failed to update page");
        }
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("An error occurred while saving the page");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/content/pages");
  };

  const handlePreview = () => {
    const slug = form.getValues("slug");
    if (slug) {
      window.open(`/${slug}`, "_blank");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Fields */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Page Content</CardTitle>
                <CardDescription>
                  Basic information about your page
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter page title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Slug */}
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL Slug *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="page-url-slug"
                          {...field}
                          onBlur={(e) => {
                            field.onBlur();
                            handleSlugBlur();
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        URL-friendly version of the title (e.g., about-us)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Excerpt */}
                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Excerpt</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Short description of the page"
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Brief summary (max 500 characters)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Content */}
                <FormField
                  control={form.control}
                  name="content_html"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter page content (HTML supported)"
                          className="min-h-[300px] font-mono text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Page content (HTML supported). Rich text editor coming soon!
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* SEO Section */}
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
                <CardDescription>
                  Optimize your page for search engines
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Meta Title */}
                <FormField
                  control={form.control}
                  name="meta_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Title</FormLabel>
                      <FormControl>
                        <Input placeholder="SEO title" {...field} />
                      </FormControl>
                      <FormDescription>
                        Recommended: 50-60 characters ({field.value?.length || 0}/60)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Meta Description */}
                <FormField
                  control={form.control}
                  name="meta_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="SEO description"
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Recommended: 150-160 characters ({field.value?.length || 0}/160)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Settings */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Page Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Template Type */}
                <FormField
                  control={form.control}
                  name="template_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Template</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select template" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="default">Default</SelectItem>
                          <SelectItem value="full-width">Full Width</SelectItem>
                          <SelectItem value="sidebar">With Sidebar</SelectItem>
                          <SelectItem value="landing">Landing Page</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Publish Status */}
                <FormField
                  control={form.control}
                  name="is_published"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Publish</FormLabel>
                        <FormDescription>
                          Make this page visible to the public
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="pt-6 space-y-2">
                <Button
                  type="submit"
                  className="w-full bg-primary-green hover:bg-primary-green/90"
                  disabled={isSubmitting}
                >
                  <HiSave className="mr-2 h-4 w-4" />
                  {isSubmitting
                    ? "Saving..."
                    : mode === "create"
                    ? "Create Page"
                    : "Update Page"}
                </Button>

                {mode === "edit" && page?.is_published && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handlePreview}
                  >
                    <HiEye className="mr-2 h-4 w-4" />
                    Preview Page
                  </Button>
                )}

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  <HiX className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}
