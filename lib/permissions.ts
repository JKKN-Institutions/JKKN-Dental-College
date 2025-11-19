/**
 * Permission utilities for role-based access control
 * Provides helper functions and React hooks for checking user permissions
 */

import { useEffect, useState } from 'react'
import { createClient } from './supabase/client'
import type { User } from '@supabase/supabase-js'

// Permission structure types
export type PermissionAction = 'view' | 'create' | 'update' | 'delete' | 'manage' | 'upload' | 'respond' | 'assign' | 'manage_folders' | 'manage_roles'

export type PermissionModule =
  | 'dashboard'
  | 'users'
  | 'hero_sections'
  | 'navigation'
  | 'pages'
  | 'home_sections'
  | 'announcements'
  | 'content_sections'
  | 'statistics'
  | 'benefits'
  | 'campus_videos'
  | 'media_library'
  | 'contact_submissions'
  | 'activity_logs'
  | 'activities'
  | 'activity_categories'
  | 'roles'
  | 'settings'

export type Permissions = {
  [key in PermissionModule]?: {
    [action: string]: boolean
  }
}

export interface UserProfile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role_type: 'super_admin' | 'custom_role' | 'user'
  role_id: string | null
  custom_permissions: Permissions | null
  status: string
  institution_id: string | null
  department_id: string | null
  roles?: {
    id: string
    name: string
    permissions: Permissions
  } | null
}

/**
 * Check if a user has a specific permission
 * @param profile - User profile with role and permissions
 * @param module - The module to check (e.g., 'hero_sections', 'users')
 * @param action - The action to check (e.g., 'view', 'create', 'update', 'delete')
 * @returns boolean - true if user has permission
 */
export function hasPermission(
  profile: UserProfile | null,
  module: PermissionModule,
  action: PermissionAction
): boolean {
  if (!profile) return false

  // Super admin has all permissions
  if (profile.role_type === 'super_admin') {
    return true
  }

  // Get effective permissions (from role or custom permissions)
  const permissions = profile.roles?.permissions || profile.custom_permissions

  if (!permissions) return false

  // Check if the specific permission exists and is true
  return permissions[module]?.[action] === true
}

/**
 * Check if user is a super admin
 */
export function isSuperAdmin(profile: UserProfile | null): boolean {
  return profile?.role_type === 'super_admin'
}

/**
 * Check if user has any admin access
 */
export function isAdmin(profile: UserProfile | null): boolean {
  return profile?.role_type === 'super_admin' || profile?.role_type === 'custom_role'
}

/**
 * Get list of modules the user has access to
 */
export function getAccessibleModules(profile: UserProfile | null): PermissionModule[] {
  if (!profile) return []

  // Super admin has access to all modules
  if (profile.role_type === 'super_admin') {
    return [
      'dashboard',
      'users',
      'pages',
      'hero_sections',
      'navigation',
      'home_sections',
      'announcements',
      'content_sections',
      'statistics',
      'benefits',
      'campus_videos',
      'media_library',
      'contact_submissions',
      'activity_logs',
      'activities',
      'activity_categories',
      'roles',
      'settings'
    ]
  }

  const permissions = profile.roles?.permissions || profile.custom_permissions
  if (!permissions) return []

  // Return modules where user has at least 'view' permission
  return Object.keys(permissions).filter(
    module => permissions[module as PermissionModule]?.view === true
  ) as PermissionModule[]
}

/**
 * React hook to get current user's profile with permissions
 */
export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    // Get initial user and profile
    const fetchProfile = async () => {
      try {
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

        if (authError) {
          console.error('[useUserProfile] Auth error:', authError)
          setLoading(false)
          return
        }

        setUser(authUser)

        if (authUser) {
          console.log('[useUserProfile] Fetching profile for user:', authUser.id)

          // Fetch profile without join to avoid RLS issues
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .maybeSingle()

          if (error) {
            console.error('[useUserProfile] Error fetching profile:', error)
            setLoading(false)
            return
          }

          if (profileData) {
            console.log('[useUserProfile] Profile fetched:', profileData.email, 'Role type:', profileData.role_type)

            // If user has a role_id, fetch the role separately
            if (profileData.role_id) {
              console.log('[useUserProfile] Fetching role:', profileData.role_id)

              const { data: roleData, error: roleError } = await supabase
                .from('roles')
                .select('id, name, permissions')
                .eq('id', profileData.role_id)
                .maybeSingle()

              if (roleError) {
                console.error('[useUserProfile] Error fetching role:', roleError)
              }

              setProfile({
                ...profileData,
                roles: roleData || null
              })
            } else {
              setProfile({
                ...profileData,
                roles: null
              })
            }
          } else {
            console.warn('[useUserProfile] No profile found for user')
          }
        }

        setLoading(false)
      } catch (err) {
        console.error('[useUserProfile] Unexpected error:', err)
        setLoading(false)
      }
    }

    fetchProfile()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null)

        if (session?.user) {
          // Fetch profile without join
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle()

          if (profileData) {
            // If user has a role_id, fetch the role separately
            if (profileData.role_id) {
              const { data: roleData } = await supabase
                .from('roles')
                .select('id, name, permissions')
                .eq('id', profileData.role_id)
                .maybeSingle()

              setProfile({
                ...profileData,
                roles: roleData || null
              })
            } else {
              setProfile({
                ...profileData,
                roles: null
              })
            }
          } else {
            setProfile(null)
          }
        } else {
          setProfile(null)
        }

        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return { profile, user, loading }
}

/**
 * React hook to check permissions
 */
export function usePermissions() {
  const { profile, loading } = useUserProfile()

  const checkPermission = (module: PermissionModule, action: PermissionAction): boolean => {
    return hasPermission(profile, module, action)
  }

  return {
    profile,
    loading,
    hasPermission: checkPermission,
    isSuperAdmin: isSuperAdmin(profile),
    isAdmin: isAdmin(profile),
    accessibleModules: getAccessibleModules(profile)
  }
}
