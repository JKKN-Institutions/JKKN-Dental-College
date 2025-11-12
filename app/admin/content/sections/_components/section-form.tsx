// =====================================================
// SECTION FORM COMPONENT
// =====================================================
// Purpose: Form for creating and editing home sections
// Module: sections
// Layer: Components
// =====================================================

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { HomeSection, CreateSectionDto, UpdateSectionDto, SectionType } from "@/types/sections";
import { useSectionMutations } from "@/hooks/sections/use-sections";
import { SectionsService } from "@/lib/services/sections/sections-service";
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
import { HiSave, HiX } from "react-icons/hi";

const sectionFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  section_key: z
    .string()
    .min(1, "Section key is required")
    .regex(/^[a-z0-9-]+$/, "Section key must contain only lowercase letters, numbers, and hyphens"),
  subtitle: z.string().max(200, "Subtitle is too long").optional(),
  section_type: z.enum([
    "hero",
    "about",
    "institutions",
    "why-choose",
    "strength",
    "news",
    "buzz",
    "events",
    "videos",
    "partners",
    "recruiters",
    "alumni",
    "life",
    "contact",
    "custom",
  ]),
  component_name: z.string().optional(),
  content_json: z.string().optional(),
  is_visible: z.boolean(),
  display_order: z.number().int().min(0),
  background_color: z.string().optional(),
  text_color: z.string().optional(),
  custom_css_class: z.string().optional(),
});

type SectionFormValues = z.infer<typeof sectionFormSchema>;

interface SectionFormProps {
  section?: HomeSection | null;
  mode: "create" | "edit";
}

export function SectionForm({ section, mode }: SectionFormProps) {
  const router = useRouter();
  const { createSection, updateSection } = useSectionMutations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [keyError, setKeyError] = useState<string | null>(null);

  const form = useForm<SectionFormValues>({
    resolver: zodResolver(sectionFormSchema),
    defaultValues: {
      title: section?.title || "",
      section_key: section?.section_key || "",
      subtitle: section?.subtitle || "",
      section_type: section?.section_type || "custom",
      component_name: section?.component_name || "",
      content_json: JSON.stringify(section?.content || {}, null, 2),
      is_visible: section?.is_visible ?? true,
      display_order: section?.display_order ?? 0,
      background_color: section?.background_color || "",
      text_color: section?.text_color || "",
      custom_css_class: section?.custom_css_class || "",
    },
  });

  // Auto-generate section key from title
  const watchTitle = form.watch("title");
  useEffect(() => {
    if (mode === "create" && watchTitle) {
      const key = watchTitle
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      form.setValue("section_key", key);
    }
  }, [watchTitle, mode, form]);

  // Check section key availability
  const handleKeyBlur = async () => {
    const key = form.getValues("section_key");
    if (!key) return;

    const isAvailable = await SectionsService.isSectionKeyAvailable(
      key,
      section?.id
    );

    if (!isAvailable) {
      setKeyError("This section key is already in use");
      form.setError("section_key", { message: "This section key is already in use" });
    } else {
      setKeyError(null);
      form.clearErrors("section_key");
    }
  };

  // Get next display order for new sections
  useEffect(() => {
    if (mode === "create") {
      SectionsService.getNextDisplayOrder().then((order) => {
        form.setValue("display_order", order);
      });
    }
  }, [mode, form]);

  const onSubmit = async (values: SectionFormValues) => {
    if (keyError) {
      toast.error("Please fix the section key error before submitting");
      return;
    }

    setIsSubmitting(true);

    try {
      // Parse content JSON
      let content = {};
      if (values.content_json) {
        try {
          content = JSON.parse(values.content_json);
        } catch (e) {
          toast.error("Invalid JSON in content field");
          setIsSubmitting(false);
          return;
        }
      }

      if (mode === "create") {
        const dto: CreateSectionDto = {
          title: values.title,
          section_key: values.section_key,
          subtitle: values.subtitle,
          section_type: values.section_type,
          component_name: values.component_name,
          content,
          is_visible: values.is_visible,
          display_order: values.display_order,
          background_color: values.background_color,
          text_color: values.text_color,
          custom_css_class: values.custom_css_class,
        };

        const newSection = await createSection(dto);
        if (newSection) {
          toast.success("Section created successfully");
          router.push("/admin/content/sections");
          router.refresh();
        } else {
          toast.error("Failed to create section");
        }
      } else if (section) {
        const dto: UpdateSectionDto = {
          id: section.id,
          title: values.title,
          section_key: values.section_key,
          subtitle: values.subtitle,
          section_type: values.section_type,
          component_name: values.component_name,
          content,
          is_visible: values.is_visible,
          display_order: values.display_order,
          background_color: values.background_color,
          text_color: values.text_color,
          custom_css_class: values.custom_css_class,
        };

        const updatedSection = await updateSection(dto);
        if (updatedSection) {
          toast.success("Section updated successfully");
          router.push("/admin/content/sections");
          router.refresh();
        } else {
          toast.error("Failed to update section");
        }
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("An error occurred while saving the section");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/content/sections");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Fields */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Section Details</CardTitle>
                <CardDescription>
                  Basic information about your home page section
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
                        <Input placeholder="Section Title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Section Key */}
                <FormField
                  control={form.control}
                  name="section_key"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Section Key *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="section-key"
                          {...field}
                          onBlur={(e) => {
                            field.onBlur();
                            handleKeyBlur();
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Unique identifier (e.g., about, institutions)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Subtitle */}
                <FormField
                  control={form.control}
                  name="subtitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subtitle</FormLabel>
                      <FormControl>
                        <Input placeholder="Optional subtitle" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Section Type */}
                <FormField
                  control={form.control}
                  name="section_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Section Type *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="hero">Hero</SelectItem>
                          <SelectItem value="about">About</SelectItem>
                          <SelectItem value="institutions">Institutions</SelectItem>
                          <SelectItem value="why-choose">Why Choose</SelectItem>
                          <SelectItem value="strength">Strength</SelectItem>
                          <SelectItem value="news">News</SelectItem>
                          <SelectItem value="buzz">Buzz</SelectItem>
                          <SelectItem value="events">Events</SelectItem>
                          <SelectItem value="videos">Videos</SelectItem>
                          <SelectItem value="partners">Partners</SelectItem>
                          <SelectItem value="recruiters">Recruiters</SelectItem>
                          <SelectItem value="alumni">Alumni</SelectItem>
                          <SelectItem value="life">Life</SelectItem>
                          <SelectItem value="contact">Contact</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Component Name */}
                <FormField
                  control={form.control}
                  name="component_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Component Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., AboutJKKN" {...field} />
                      </FormControl>
                      <FormDescription>
                        React component name to render this section
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Content JSON */}
                <FormField
                  control={form.control}
                  name="content_json"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content (JSON)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='{"key": "value"}'
                          className="min-h-[200px] font-mono text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Section-specific data in JSON format
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Styling Section */}
            <Card>
              <CardHeader>
                <CardTitle>Styling (Optional)</CardTitle>
                <CardDescription>
                  Customize the appearance of this section
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Background Color */}
                  <FormField
                    control={form.control}
                    name="background_color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Background Color</FormLabel>
                        <FormControl>
                          <Input placeholder="#ffffff" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Text Color */}
                  <FormField
                    control={form.control}
                    name="text_color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Text Color</FormLabel>
                        <FormControl>
                          <Input placeholder="#000000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Custom CSS Class */}
                <FormField
                  control={form.control}
                  name="custom_css_class"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custom CSS Class</FormLabel>
                      <FormControl>
                        <Input placeholder="my-custom-class" {...field} />
                      </FormControl>
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
                <CardTitle>Section Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                          min="0"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>
                        Lower numbers appear first
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Visibility */}
                <FormField
                  control={form.control}
                  name="is_visible"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Visible</FormLabel>
                        <FormDescription>
                          Show this section on home page
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
                    ? "Create Section"
                    : "Update Section"}
                </Button>

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
