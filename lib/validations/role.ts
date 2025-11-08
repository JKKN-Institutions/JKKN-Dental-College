/**
 * Validation schemas for role management operations
 * Uses Zod for type-safe validation
 */

import { z } from 'zod'

// Permission modules available in the system
export const permissionModules = [
  'dashboard',
  'users',
  'hero_sections',
  'navigation',
  'announcements',
  'content_sections',
  'statistics',
  'benefits',
  'campus_videos',
  'media_library',
  'contact_submissions',
  'activity_logs',
  'roles',
  'settings',
] as const

// Permission actions available
export const permissionActions = [
  'view',
  'create',
  'update',
  'delete',
  'manage',
  'upload',
  'respond',
  'assign',
  'manage_folders',
  'manage_roles',
] as const

// Schema for individual module permissions
// Using partial to allow incomplete permission objects
const modulePermissionsSchema = z.record(
  z.string(),
  z.boolean()
).optional()

// Schema for all permissions
// Using z.string() to allow partial records
const permissionsSchema = z.record(
  z.string(),
  modulePermissionsSchema
)

// Create role schema
export const createRoleSchema = z.object({
  name: z
    .string()
    .min(2, 'Role name must be at least 2 characters')
    .max(50, 'Role name must not exceed 50 characters')
    .regex(/^[a-zA-Z0-9\s-]+$/, 'Role name can only contain letters, numbers, spaces, and hyphens'),

  description: z
    .string()
    .max(500, 'Description must not exceed 500 characters')
    .optional()
    .nullable(),

  permissions: permissionsSchema,
})

// Update role schema (same as create)
export const updateRoleSchema = createRoleSchema

// Clone role schema
export const cloneRoleSchema = z.object({
  source_role_id: z.string().uuid('Invalid role ID'),
  name: z
    .string()
    .min(2, 'Role name must be at least 2 characters')
    .max(50, 'Role name must not exceed 50 characters')
    .regex(/^[a-zA-Z0-9\s-]+$/, 'Role name can only contain letters, numbers, spaces, and hyphens'),
  description: z
    .string()
    .max(500, 'Description must not exceed 500 characters')
    .optional()
    .nullable(),
})

// Permission preset schemas for quick role creation
export const permissionPresets = {
  viewOnly: {
    dashboard: { view: true },
  },
  contentManager: {
    dashboard: { view: true },
    hero_sections: { view: true, create: true, update: true, delete: true },
    navigation: { view: true, create: true, update: true, delete: true },
    announcements: { view: true, create: true, update: true, delete: true },
    content_sections: { view: true, create: true, update: true, delete: true },
    statistics: { view: true, create: true, update: true, delete: true },
    benefits: { view: true, create: true, update: true, delete: true },
    campus_videos: { view: true, create: true, update: true, delete: true },
    media_library: { view: true, upload: true, delete: true, manage_folders: true },
    activity_logs: { view: true },
  },
  supportStaff: {
    dashboard: { view: true },
    contact_submissions: { view: true, respond: true, assign: true },
    activity_logs: { view: true },
  },
  mediaManager: {
    dashboard: { view: true },
    media_library: { view: true, upload: true, delete: true, manage_folders: true },
    campus_videos: { view: true, create: true, update: true, delete: true },
  },
  analyticsViewer: {
    dashboard: { view: true },
    activity_logs: { view: true },
    statistics: { view: true },
    contact_submissions: { view: true },
  },
}

// Module metadata for UI display
export const moduleMetadata: Record<
  typeof permissionModules[number],
  {
    label: string
    description: string
    actions: Array<{
      action: typeof permissionActions[number]
      label: string
      description: string
    }>
  }
> = {
  dashboard: {
    label: 'Dashboard',
    description: 'Access to admin dashboard overview',
    actions: [
      { action: 'view', label: 'View Dashboard', description: 'Can view dashboard statistics and overview' },
    ],
  },
  users: {
    label: 'User Management',
    description: 'Manage users, roles, and permissions',
    actions: [
      { action: 'view', label: 'View Users', description: 'Can view user list and details' },
      { action: 'create', label: 'Create Users', description: 'Can create new user accounts' },
      { action: 'update', label: 'Update Users', description: 'Can edit user information' },
      { action: 'delete', label: 'Delete Users', description: 'Can delete user accounts' },
      { action: 'manage_roles', label: 'Manage Roles', description: 'Can assign roles to users' },
    ],
  },
  hero_sections: {
    label: 'Hero Sections',
    description: 'Manage homepage hero banners',
    actions: [
      { action: 'view', label: 'View', description: 'Can view hero sections' },
      { action: 'create', label: 'Create', description: 'Can create new hero sections' },
      { action: 'update', label: 'Update', description: 'Can edit hero sections' },
      { action: 'delete', label: 'Delete', description: 'Can delete hero sections' },
    ],
  },
  navigation: {
    label: 'Navigation',
    description: 'Manage site navigation menus',
    actions: [
      { action: 'view', label: 'View', description: 'Can view navigation items' },
      { action: 'create', label: 'Create', description: 'Can create navigation items' },
      { action: 'update', label: 'Update', description: 'Can edit navigation items' },
      { action: 'delete', label: 'Delete', description: 'Can delete navigation items' },
    ],
  },
  announcements: {
    label: 'Announcements',
    description: 'Manage site announcements',
    actions: [
      { action: 'view', label: 'View', description: 'Can view announcements' },
      { action: 'create', label: 'Create', description: 'Can create announcements' },
      { action: 'update', label: 'Update', description: 'Can edit announcements' },
      { action: 'delete', label: 'Delete', description: 'Can delete announcements' },
    ],
  },
  content_sections: {
    label: 'Content Sections',
    description: 'Manage dynamic page sections',
    actions: [
      { action: 'view', label: 'View', description: 'Can view content sections' },
      { action: 'create', label: 'Create', description: 'Can create content sections' },
      { action: 'update', label: 'Update', description: 'Can edit content sections' },
      { action: 'delete', label: 'Delete', description: 'Can delete content sections' },
    ],
  },
  statistics: {
    label: 'Statistics',
    description: 'Manage institutional statistics',
    actions: [
      { action: 'view', label: 'View', description: 'Can view statistics' },
      { action: 'create', label: 'Create', description: 'Can create statistics' },
      { action: 'update', label: 'Update', description: 'Can edit statistics' },
      { action: 'delete', label: 'Delete', description: 'Can delete statistics' },
    ],
  },
  benefits: {
    label: 'Benefits',
    description: 'Manage institution benefits/features',
    actions: [
      { action: 'view', label: 'View', description: 'Can view benefits' },
      { action: 'create', label: 'Create', description: 'Can create benefits' },
      { action: 'update', label: 'Update', description: 'Can edit benefits' },
      { action: 'delete', label: 'Delete', description: 'Can delete benefits' },
    ],
  },
  campus_videos: {
    label: 'Campus Videos',
    description: 'Manage video library',
    actions: [
      { action: 'view', label: 'View', description: 'Can view videos' },
      { action: 'create', label: 'Create', description: 'Can upload new videos' },
      { action: 'update', label: 'Update', description: 'Can edit video details' },
      { action: 'delete', label: 'Delete', description: 'Can delete videos' },
    ],
  },
  media_library: {
    label: 'Media Library',
    description: 'Manage media files and folders',
    actions: [
      { action: 'view', label: 'View', description: 'Can view media files' },
      { action: 'upload', label: 'Upload', description: 'Can upload media files' },
      { action: 'delete', label: 'Delete', description: 'Can delete media files' },
      { action: 'manage_folders', label: 'Manage Folders', description: 'Can create/edit/delete folders' },
    ],
  },
  contact_submissions: {
    label: 'Contact Submissions',
    description: 'Manage contact form inquiries',
    actions: [
      { action: 'view', label: 'View', description: 'Can view submissions' },
      { action: 'respond', label: 'Respond', description: 'Can respond to inquiries' },
      { action: 'assign', label: 'Assign', description: 'Can assign inquiries to team members' },
      { action: 'delete', label: 'Delete', description: 'Can delete submissions' },
    ],
  },
  activity_logs: {
    label: 'Activity Logs',
    description: 'View system activity and audit trails',
    actions: [
      { action: 'view', label: 'View', description: 'Can view activity logs' },
    ],
  },
  roles: {
    label: 'Role Management',
    description: 'Manage custom roles and permissions',
    actions: [
      { action: 'view', label: 'View Roles', description: 'Can view roles' },
      { action: 'create', label: 'Create Roles', description: 'Can create custom roles' },
      { action: 'update', label: 'Update Roles', description: 'Can edit role permissions' },
      { action: 'delete', label: 'Delete Roles', description: 'Can delete custom roles' },
    ],
  },
  settings: {
    label: 'Settings',
    description: 'Manage system settings',
    actions: [
      { action: 'view', label: 'View', description: 'Can view settings' },
      { action: 'update', label: 'Update', description: 'Can modify settings' },
    ],
  },
}

// Export TypeScript types
export type CreateRoleInput = z.infer<typeof createRoleSchema>
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>
export type CloneRoleInput = z.infer<typeof cloneRoleSchema>
export type PermissionModule = typeof permissionModules[number]
export type PermissionAction = typeof permissionActions[number]
export type Permissions = z.infer<typeof permissionsSchema>
