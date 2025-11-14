// =====================================================
// CAMPUS VIDEOS SECTION FORM
// =====================================================
// Purpose: Form for managing Campus Videos section content
// Allows add/edit/delete of video items dynamically from database
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
  getAllCampusVideos,
  createCampusVideo,
  updateCampusVideo,
  deleteCampusVideo,
  toggleCampusVideoStatus,
  type CampusVideo,
  type CampusVideosInput,
} from "@/app/admin/content/sections/[id]/edit/_actions/campus-videos-actions";

interface CampusVideosSectionFormProps {
  section: HomeSection;
}

const videoItemSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().optional(),
  category: z.string().optional(),
  video_url: z.string().url("Must be a valid URL"),
  thumbnail_url: z.string().url("Must be a valid URL").optional(),
  duration: z.number().int().positive().optional(),
  order_index: z.number().int().optional(),
  is_active: z.boolean().optional(),
});

type VideoItemFormValues = z.infer<typeof videoItemSchema>;

export function CampusVideosSectionForm({ section }: CampusVideosSectionFormProps) {
  const [videoItems, setVideoItems] = useState<CampusVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm<VideoItemFormValues>({
    resolver: zodResolver(videoItemSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      video_url: "",
      thumbnail_url: "",
      duration: undefined,
      order_index: 0,
      is_active: true,
    },
  });

  useEffect(() => {
    loadVideoItems();
  }, []);

  const loadVideoItems = async () => {
    setIsLoading(true);
    const result = await getAllCampusVideos();
    if (result.success && result.data) {
      setVideoItems(result.data);
    } else {
      toast.error(result.error || "Failed to load videos");
    }
    setIsLoading(false);
  };

  const handleSubmit = async (values: VideoItemFormValues) => {
    setIsSubmitting(true);
    try {
      const input: CampusVideosInput = {
        title: values.title,
        description: values.description,
        category: values.category,
        video_url: values.video_url,
        thumbnail_url: values.thumbnail_url,
        duration: values.duration,
        order_index: values.order_index ?? 0,
        is_active: values.is_active ?? true,
      };

      let result;
      if (editingId) {
        result = await updateCampusVideo(editingId, input);
        if (result.success) {
          toast.success("Video updated successfully!");
        }
      } else {
        result = await createCampusVideo(input);
        if (result.success) {
          toast.success("Video created successfully!");
        }
      }

      if (!result.success) {
        toast.error(result.error || "Failed to save video");
        return;
      }

      form.reset({
        title: "",
        description: "",
        category: "",
        video_url: "",
        thumbnail_url: "",
        duration: undefined,
        order_index: 0,
        is_active: true,
      });
      setEditingId(null);
      await loadVideoItems();
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("[CampusVideosSectionForm] Error saving:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (video: CampusVideo) => {
    setEditingId(video.id);
    form.reset({
      title: video.title,
      description: video.description || "",
      category: video.category || "",
      video_url: video.video_url,
      thumbnail_url: video.thumbnail_url || "",
      duration: video.duration || undefined,
      order_index: video.order_index,
      is_active: video.is_active,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this video?")) {
      return;
    }

    const result = await deleteCampusVideo(id);
    if (result.success) {
      toast.success("Video deleted successfully!");
      await loadVideoItems();
      if (editingId === id) {
        setEditingId(null);
        form.reset();
      }
    } else {
      toast.error(result.error || "Failed to delete video");
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const result = await toggleCampusVideoStatus(id, !currentStatus);
    if (result.success) {
      toast.success(`Video ${!currentStatus ? "activated" : "deactivated"}`);
      await loadVideoItems();
    } else {
      toast.error(result.error || "Failed to toggle status");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    form.reset({
      title: "",
      description: "",
      category: "",
      video_url: "",
      thumbnail_url: "",
      duration: undefined,
      order_index: 0,
      is_active: true,
    });
  };

  return (
    <div className="space-y-8">
      {/* Add/Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>
            {editingId ? "Edit Video" : "Add New Video"}
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
                      <Input placeholder="Campus Tour 2024" {...field} />
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of the video..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Video URL */}
              <FormField
                control={form.control}
                name="video_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video URL *</FormLabel>
                    <FormControl>
                      <Input placeholder="https://youtube.com/watch?v=..." {...field} />
                    </FormControl>
                    <FormDescription>
                      YouTube, Vimeo, or direct video URL
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Thumbnail URL */}
              <FormField
                control={form.control}
                name="thumbnail_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thumbnail URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/thumbnail.jpg" {...field} />
                    </FormControl>
                    <FormDescription>
                      Optional custom thumbnail image
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Category */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input placeholder="Campus Tour, Events, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Duration */}
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (seconds)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="120"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Display Order */}
                <FormField
                  control={form.control}
                  name="order_index"
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
                        Lower numbers first
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                      <FormLabel>Active</FormLabel>
                      <FormDescription>
                        Show this video on the website
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting}>
                  <HiSave className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Saving..." : editingId ? "Update Video" : "Add Video"}
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

      {/* Videos Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Videos ({videoItems.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading videos...</div>
          ) : videoItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No videos yet</p>
              <p className="text-sm text-gray-400">Add your first video using the form above</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-3 font-semibold">Order</th>
                    <th className="text-left p-3 font-semibold">Thumbnail</th>
                    <th className="text-left p-3 font-semibold">Title</th>
                    <th className="text-left p-3 font-semibold">Category</th>
                    <th className="text-left p-3 font-semibold">Duration</th>
                    <th className="text-left p-3 font-semibold">Views</th>
                    <th className="text-left p-3 font-semibold">Status</th>
                    <th className="text-left p-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {videoItems.map((video) => (
                    <tr key={video.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{video.order_index}</td>
                      <td className="p-3">
                        {video.thumbnail_url ? (
                          <img
                            src={video.thumbnail_url}
                            alt={video.title}
                            className="w-20 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-20 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                            No thumb
                          </div>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="font-medium">{video.title}</div>
                        {video.description && (
                          <div className="text-sm text-gray-500 line-clamp-1">
                            {video.description}
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-sm">{video.category || "N/A"}</td>
                      <td className="p-3 text-sm">
                        {video.duration ? `${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}` : "N/A"}
                      </td>
                      <td className="p-3 text-sm">{video.view_count}</td>
                      <td className="p-3">
                        <Button
                          size="sm"
                          variant={video.is_active ? "default" : "outline"}
                          onClick={() => handleToggleStatus(video.id, video.is_active)}
                        >
                          {video.is_active ? (
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
                            onClick={() => handleEdit(video)}
                          >
                            <HiPencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(video.id)}
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
