/**
 * TypeScript type definitions for the permission system
 */

export type RoleType = 'super_admin' | 'custom_role' | 'user'
export type UserStatus = 'active' | 'blocked' | 'pending'

export type PermissionAction =
  | 'view'
  | 'create'
  | 'update'
  | 'delete'
  | 'manage'
  | 'upload'
  | 'respond'
  | 'assign'
  | 'manage_folders'
  | 'manage_roles'

export type PermissionModule =
  | 'dashboard'
  | 'users'
  | 'hero_sections'
  | 'navigation'
  | 'announcements'
  | 'content_sections'
  | 'statistics'
  | 'benefits'
  | 'campus_videos'
  | 'media_library'
  | 'contact_submissions'
  | 'activity_logs'
  | 'roles'
  | 'settings'

export type ModulePermissions = {
  [action in PermissionAction]?: boolean
}

export type Permissions = {
  [module in PermissionModule]?: ModulePermissions
}

export interface Role {
  id: string
  name: string
  description: string | null
  permissions: Permissions
  is_system_role: boolean
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  phone: string | null
  role: 'user' | 'admin' | 'super_admin' // Legacy field
  role_type: RoleType
  role_id: string | null
  custom_permissions: Permissions | null
  status: UserStatus
  department: string | null
  designation: string | null
  approved_by: string | null
  approved_at: string | null
  created_by: string | null
  last_login_at: string | null
  login_count: number
  created_at: string
  updated_at: string
  // Relations
  roles?: Role | null
}

export interface PermissionCheckResult {
  allowed: boolean
  reason?: string
}
