// =====================================================
// NEWS SECTION FORM
// =====================================================
// Purpose: Form for managing College News section content
// Allows add/edit/delete of news items dynamically from database
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { HiPlus, HiTrash, HiSave, HiPencil, HiEye, HiEyeOff } from "react-icons/hi";
import { toast } from "sonner";
import {
  getAllCollegeNews,
  createCollegeNews,
  updateCollegeNews,
  deleteCollegeNews,
  toggleCollegeNewsStatus,
  type CollegeNews,
  type CollegeNewsInput,
} from "@/app/admin/content/sections/[id]/edit/_actions/college-news-actions";

interface NewsSectionFormProps {
  section: HomeSection;
  onSave: (content: any) => Promise<void>;
}

const newsItemSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(1, "Description is required"),
  image_url: z.string().url("Must be a valid URL"),
  published_date: z.string().optional(),
  is_active: z.boolean().optional(),
  display_order: z.number().int().optional(),
});

type NewsItemFormValues = z.infer<typeof newsItemSchema>;

export function NewsSectionForm({ section }: NewsSectionFormProps) {
  const [newsItems, setNewsItems] = useState<CollegeNews[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm<NewsItemFormValues>({
    resolver: zodResolver(newsItemSchema),
    defaultValues: {
      title: "",
      description: "",
      image_url: "",
      published_date: new Date().toISOString().split("T")[0],
      is_active: true,
      display_order: 0,
    },
  });

  // Load news items on mount
  useEffect(() => {
    loadNewsItems();
  }, []);

  const loadNewsItems = async () => {
    setIsLoading(true);
    const result = await getAllCollegeNews();
    if (result.success && result.data) {
      setNewsItems(result.data);
    } else {
      toast.error(result.error || "Failed to load news items");
    }
    setIsLoading(false);
  };

  const handleSubmit = async (values: NewsItemFormValues) => {
    setIsSubmitting(true);
    try {
      const input: CollegeNewsInput = {
        title: values.title,
        description: values.description,
        image_url: values.image_url,
        published_date: values.published_date,
        is_active: values.is_active ?? true,
        display_order: values.display_order ?? 0,
      };

      let result;
      if (editingId) {
        // Update existing news
        result = await updateCollegeNews(editingId, input);
        if (result.success) {
          toast.success("News item updated successfully!");
        }
      } else {
        // Create new news
        result = await createCollegeNews(input);
        if (result.success) {
          toast.success("News item created successfully!");
        }
      }

      if (!result.success) {
        toast.error(result.error || "Failed to save news item");
        return;
      }

      // Reset form and reload
      form.reset({
        title: "",
        description: "",
        image_url: "",
        published_date: new Date().toISOString().split("T")[0],
        is_active: true,
        display_order: 0,
      });
      setEditingId(null);
      await loadNewsItems();
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("[NewsSectionForm] Error saving:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (news: CollegeNews) => {
    setEditingId(news.id);
    form.reset({
      title: news.title,
      description: news.description,
      image_url: news.image_url,
      published_date: news.published_date || new Date().toISOString().split("T")[0],
      is_active: news.is_active,
      display_order: news.display_order,
    });
    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this news item?")) {
      return;
    }

    const result = await deleteCollegeNews(id);
    if (result.success) {
      toast.success("News item deleted successfully!");
      await loadNewsItems();
      if (editingId === id) {
        setEditingId(null);
        form.reset();
      }
    } else {
      toast.error(result.error || "Failed to delete news item");
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const result = await toggleCollegeNewsStatus(id, !currentStatus);
    if (result.success) {
      toast.success(`News item ${!currentStatus ? "activated" : "deactivated"}`);
      await loadNewsItems();
    } else {
      toast.error(result.error || "Failed to toggle status");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    form.reset({
      title: "",
      description: "",
      image_url: "",
      published_date: new Date().toISOString().split("T")[0],
      is_active: true,
      display_order: 0,
    });
  };

  return (
    <div className="space-y-8">
      {/* Add/Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>
            {editingId ? "Edit News Item" : "Add New News Item"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="JKKN Receives NAAC A+ Accreditation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of the news..."
                        rows={4}
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
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL *</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image.jpg" {...field} />
                      </FormControl>
                      <FormDescription>
                        Full URL to the news image
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Published Date */}
                <FormField
                  control={form.control}
                  name="published_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Published Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                {/* Is Active */}
                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Active
                        </FormLabel>
                        <FormDescription>
                          Show this news item on the website
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting}>
                  <HiSave className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Saving..." : editingId ? "Update News" : "Add News"}
                </Button>
                {editingId && (
                  <Button type="button" variant="outline" onClick={handleCancelEdit}>
                    Cancel Edit
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* News Items Table */}
      <Card>
        <CardHeader>
          <CardTitle>All News Items ({newsItems.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading news items...</div>
          ) : newsItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No news items yet</p>
              <p className="text-sm text-gray-400">Add your first news item using the form above</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-3 font-semibold">Order</th>
                    <th className="text-left p-3 font-semibold">Image</th>
                    <th className="text-left p-3 font-semibold">Title</th>
                    <th className="text-left p-3 font-semibold">Date</th>
                    <th className="text-left p-3 font-semibold">Status</th>
                    <th className="text-left p-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {newsItems.map((news) => (
                    <tr key={news.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{news.display_order}</td>
                      <td className="p-3">
                        <img
                          src={news.image_url}
                          alt={news.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="p-3">
                        <div className="font-medium">{news.title}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">
                          {news.description}
                        </div>
                      </td>
                      <td className="p-3 text-sm">
                        {news.published_date
                          ? new Date(news.published_date).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="p-3">
                        <Button
                          size="sm"
                          variant={news.is_active ? "default" : "outline"}
                          onClick={() => handleToggleStatus(news.id, news.is_active)}
                        >
                          {news.is_active ? (
                            <>
                              <HiEye className="w-4 h-4 mr-1" />
                              Active
                            </>
                          ) : (
                            <>
                              <HiEyeOff className="w-4 h-4 mr-1" />
                              Inactive
                            </>
                          )}
                        </Button>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(news)}
                          >
                            <HiPencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(news.id)}
                          >
                            <HiTrash className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
