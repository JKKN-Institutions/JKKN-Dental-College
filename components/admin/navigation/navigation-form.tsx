// =====================================================
// NAVIGATION FORM
// =====================================================
// Purpose: Create/Edit form for navigation items
// Module: navigation
// Layer: Components
// =====================================================

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { NavigationItem, CreateNavigationItemDto, UpdateNavigationItemDto } from "@/types/navigation";
import { useNavigationMutations, useNavigationItems } from "@/hooks/navigation/use-navigation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { HiSave, HiX } from "react-icons/hi";
import { useEffect } from "react";

// Validation Schema
const navigationFormSchema = z.object({
  label: z.string().min(1, "Label is required").max(100, "Label too long"),
  url: z.string().min(1, "URL is required").max(500, "URL too long"),
  icon: z.string().optional(),
  target: z.enum(["_self", "_blank"]),
  link_type: z.enum(["page", "section", "external", "custom"]),
  create_page: z.boolean(),
  page_title: z.string().optional(),
  parent_id: z.string().optional(),
  display_order: z.number().int().min(0),
  is_active: z.boolean(),
  is_featured: z.boolean(),
  requires_auth: z.boolean(),
});

type NavigationFormValues = z.infer<typeof navigationFormSchema>;

interface NavigationFormProps {
  navigationItem?: NavigationItem | null;
  mode: "create" | "edit";
}

export function NavigationForm({ navigationItem, mode }: NavigationFormProps) {
  const router = useRouter();
  const { createNavigationItem, updateNavigationItem, loading } = useNavigationMutations();

  // Fetch all navigation items for parent selection
  const { navigationItems } = useNavigationItems({}, 1, 100);

  const form = useForm<NavigationFormValues>({
    resolver: zodResolver(navigationFormSchema),
    defaultValues: {
      label: navigationItem?.label || "",
      url: navigationItem?.url || "",
      icon: navigationItem?.icon || "",
      target: navigationItem?.target || "_self",
      link_type: navigationItem?.link_type || "external",
      create_page: false,
      page_title: "",
      parent_id: navigationItem?.parent_id || undefined,
      display_order: navigationItem?.display_order || 0,
      is_active: navigationItem?.is_active ?? true,
      is_featured: navigationItem?.is_featured ?? false,
      requires_auth: navigationItem?.requires_auth ?? false,
    },
  });

  // Reset form when navigationItem changes
  useEffect(() => {
    if (navigationItem) {
      form.reset({
        label: navigationItem.label,
        url: navigationItem.url,
        icon: navigationItem.icon || "",
        target: navigationItem.target,
        parent_id: navigationItem.parent_id || undefined,
        display_order: navigationItem.display_order,
        is_active: navigationItem.is_active,
        is_featured: navigationItem.is_featured,
        requires_auth: navigationItem.requires_auth,
      });
    }
  }, [navigationItem, form]);

  const onSubmit = async (values: NavigationFormValues) => {
    try {
      if (mode === "create") {
        const dto: CreateNavigationItemDto = {
          label: values.label,
          url: values.url,
          icon: values.icon || undefined,
          target: values.target,
          link_type: values.link_type,
          create_page: values.create_page,
          parent_id: values.parent_id || undefined,
          display_order: values.display_order,
          is_active: values.is_active,
          is_featured: values.is_featured,
          requires_auth: values.requires_auth,
        };

        const result = await createNavigationItem(dto);

        if (result) {
          if (values.create_page) {
            toast.success("Navigation item and page created successfully!");
          } else {
            toast.success("Navigation item created successfully");
          }
          router.push("/admin/content/navigation");
          router.refresh();
        } else {
          toast.error("Failed to create navigation item");
        }
      } else if (mode === "edit" && navigationItem) {
        const dto: UpdateNavigationItemDto = {
          id: navigationItem.id,
          label: values.label,
          url: values.url,
          icon: values.icon || undefined,
          target: values.target,
          link_type: values.link_type,
          parent_id: values.parent_id || undefined,
          display_order: values.display_order,
          is_active: values.is_active,
          is_featured: values.is_featured,
          requires_auth: values.requires_auth,
        };

        const result = await updateNavigationItem(dto);

        if (result) {
          toast.success("Navigation item updated successfully");
          router.push("/admin/content/navigation");
          router.refresh();
        } else {
          toast.error("Failed to update navigation item");
        }
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleCancel = () => {
    router.push("/admin/content/navigation");
  };

  // Filter out current item and its descendants from parent options
  const availableParents = navigationItems.filter((item) => {
    if (mode === "edit" && navigationItem) {
      // Don't allow selecting self or descendants
      return item.id !== navigationItem.id && item.parent_id !== navigationItem.id;
    }
    return true;
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Basic Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Label */}
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label *</FormLabel>
                  <FormControl>
                    <Input placeholder="Home" {...field} />
                  </FormControl>
                  <FormDescription>
                    The text displayed in the navigation menu
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* URL */}
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL *</FormLabel>
                  <FormControl>
                    <Input placeholder="/" {...field} />
                  </FormControl>
                  <FormDescription>
                    The link destination (e.g., /, /about, https://example.com)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Link Type & Auto-Create Page */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Link Type */}
            <FormField
              control={form.control}
              name="link_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link Type *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select link type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="page">📄 Dynamic Page</SelectItem>
                      <SelectItem value="section">📍 Home Section (Scroll)</SelectItem>
                      <SelectItem value="external">🔗 External URL</SelectItem>
                      <SelectItem value="custom">⚙️ Custom Link</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose how this menu item should work
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Auto-Create Page Option (only for 'page' link type in create mode) */}
            {mode === "create" && form.watch("link_type") === "page" && (
              <FormField
                control={form.control}
                name="create_page"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Auto-Create Page</FormLabel>
                      <FormDescription>
                        Automatically create a page for this menu
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
            )}
          </div>

          {/* Info Box for Auto-Create */}
          {mode === "create" && form.watch("link_type") === "page" && form.watch("create_page") && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 font-medium text-sm">✨ Auto-Page Creation Enabled</p>
              <p className="text-blue-600 text-xs mt-1">
                A new page will be created with the slug from your URL field. You can edit the page content later from Pages Management.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Icon */}
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="HiHome" {...field} />
                  </FormControl>
                  <FormDescription>
                    Icon name or URL (e.g., HiHome for React Icons)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Target */}
            <FormField
              control={form.control}
              name="target"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link Target</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select target" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="_self">Same Tab (_self)</SelectItem>
                      <SelectItem value="_blank">New Tab (_blank)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Open in same window or new tab
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Hierarchy */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Hierarchy</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Parent */}
            <FormField
              control={form.control}
              name="parent_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Item (Optional)</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value === "none" ? undefined : value)}
                    value={field.value || "none"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="None (Top Level)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None (Top Level)</SelectItem>
                      {availableParents.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {"→ ".repeat(item.depth)}{item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select a parent to create a submenu item
                  </FormDescription>
                  <FormMessage />
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
                      min="0"
                      value={field.value}
                      onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormDescription>
                    Lower numbers appear first (e.g., 0, 1, 2...)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Settings</h3>

          <div className="space-y-4">
            {/* Active Status */}
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-200 p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active</FormLabel>
                    <FormDescription>
                      Show this item in the navigation menu
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

            {/* Featured */}
            <FormField
              control={form.control}
              name="is_featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-200 p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Featured</FormLabel>
                    <FormDescription>
                      Highlight this item in the navigation (e.g., special styling)
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

            {/* Requires Auth */}
            <FormField
              control={form.control}
              name="requires_auth"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-200 p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Requires Authentication</FormLabel>
                    <FormDescription>
                      Only show this item to logged-in users
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
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={loading}
          >
            <HiX className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-primary-green hover:bg-primary-green/90"
          >
            <HiSave className="mr-2 h-4 w-4" />
            {loading
              ? mode === "create"
                ? "Creating..."
                : "Saving..."
              : mode === "create"
              ? "Create Navigation Item"
              : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
