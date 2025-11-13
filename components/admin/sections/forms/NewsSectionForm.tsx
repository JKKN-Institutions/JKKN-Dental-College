// =====================================================
// NEWS SECTION FORM
// =====================================================
// Purpose: Form for managing College News section content
// Allows add/edit/delete of news items dynamically
// =====================================================

"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { HomeSection, NewsSectionContent } from "@/types/sections";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { HiPlus, HiTrash, HiSave } from "react-icons/hi";
import { toast } from "sonner";

interface NewsSectionFormProps {
  section: HomeSection;
  onSave: (content: NewsSectionContent) => Promise<void>;
}

const newsItemSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  image: z.string().url("Must be a valid URL"),
  date: z.string(),
  category: z.string().optional(),
  link: z.string().optional(),
});

const newsSectionSchema = z.object({
  news_items: z.array(newsItemSchema),
});

type NewsSectionFormValues = z.infer<typeof newsSectionSchema>;

export function NewsSectionForm({ section, onSave }: NewsSectionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const content = (section.content || {}) as NewsSectionContent;

  const form = useForm<NewsSectionFormValues>({
    resolver: zodResolver(newsSectionSchema),
    defaultValues: {
      news_items: content.news_items || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "news_items",
  });

  const handleSubmit = async (values: NewsSectionFormValues) => {
    setIsSubmitting(true);
    try {
      console.log("[NewsSectionForm] Submitting values:", values);
      await onSave(values);
      toast.success("News section updated successfully!");
    } catch (error) {
      toast.error("Failed to update news section");
      console.error("[NewsSectionForm] Error saving:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addNewsItem = () => {
    append({
      id: `news-${Date.now()}`,
      title: "",
      excerpt: "",
      image: "",
      date: new Date().toISOString().split("T")[0],
      category: "General",
      link: "",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">College News Items</h3>
            <p className="text-sm text-gray-600">
              Add, edit, or remove news items that will appear on your homepage
            </p>
          </div>
          <Button type="button" onClick={addNewsItem} variant="outline">
            <HiPlus className="w-4 h-4 mr-2" />
            Add News Item
          </Button>
        </div>

        {/* News Items */}
        <div className="space-y-4">
          {fields.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-gray-500 mb-4">No news items yet</p>
                <Button type="button" onClick={addNewsItem} variant="outline">
                  <HiPlus className="w-4 h-4 mr-2" />
                  Add Your First News Item
                </Button>
              </CardContent>
            </Card>
          ) : (
            fields.map((field, index) => (
              <Card key={field.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">News Item #{index + 1}</CardTitle>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      <HiTrash className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Title */}
                    <FormField
                      control={form.control}
                      name={`news_items.${index}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title *</FormLabel>
                          <FormControl>
                            <Input placeholder="Convocation 2025 Announced" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Date */}
                    <FormField
                      control={form.control}
                      name={`news_items.${index}.date`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date *</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Excerpt */}
                  <FormField
                    control={form.control}
                    name={`news_items.${index}.excerpt`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Excerpt *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Brief description of the news..."
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Image URL */}
                    <FormField
                      control={form.control}
                      name={`news_items.${index}.image`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL *</FormLabel>
                          <FormControl>
                            <Input placeholder="https://..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Category */}
                    <FormField
                      control={form.control}
                      name={`news_items.${index}.category`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <FormControl>
                            <Input placeholder="Events, Admissions, etc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Link (Optional) */}
                  <FormField
                    control={form.control}
                    name={`news_items.${index}.link`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Read More Link (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="/news/convocation-2025" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={isSubmitting}>
            <HiSave className="w-4 h-4 mr-2" />
            {isSubmitting ? "Saving..." : "Save News Section"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
