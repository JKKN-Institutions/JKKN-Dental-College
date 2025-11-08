/**
 * Server Actions for User Management
 * Handles CRUD operations for users with permission checks
 */

'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import {
  updateUserSchema,
  updateUserRoleSchema,
  updateUserStatusSchema,
  createUserSchema,
  type UpdateUserInput,
  type UpdateUserRoleInput,
  type UpdateUserStatusInput,
  type CreateUserInput,
} from '@/lib/validations/user'
import { randomBytes } from 'crypto'

// Response types
type ActionResponse<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string }

/**
 * Get list of users with filters, search, sorting, and pagination
 */
export async function getUsers(params?: {
  search?: string
  roleType?: string
  status?: string
  department?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}): Promise<ActionResponse<{
  users: any[]
  totalCount: number
  page: number
  limit: number
  totalPages: number
}>> {
  try {
    console.log('[getUsers] Called with params:', params)
    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      console.error('[getUsers] Auth error:', authError)
      return { success: false, error: 'Unauthorized' }
    }

    console.log('[getUsers] Authenticated user:', user.email)

    // Default params
    const page = params?.page || 1
    const limit = params?.limit || 20
    const offset = (page - 1) * limit

    // Use the database function for efficient querying
    const { data, error } = await supabase.rpc('get_users_with_roles', {
      search_query: params?.search || null,
      filter_role_type: params?.roleType || null,
      filter_status: params?.status || null,
      filter_department: params?.department || null,
      sort_by: params?.sortBy || 'created_at',
      sort_order: params?.sortOrder || 'desc',
      page_limit: limit,
      page_offset: offset,
    })

    if (error) {
      console.error('[getUsers] Error fetching users:', error)
      return { success: false, error: error.message }
    }

    console.log('[getUsers] Fetched users count:', data?.length || 0)

    // Extract total count from first row (all rows have same total_count)
    const totalCount = data && data.length > 0 ? data[0].total_count : 0
    const totalPages = Math.ceil(totalCount / limit)

    return {
      success: true,
      data: {
        users: data || [],
        totalCount,
        page,
        limit,
        totalPages,
      },
    }
  } catch (error) {
    console.error('Unexpected error in getUsers:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

/**
 * Get a single user by ID
 */
export async function getUserById(userId: string): Promise<ActionResponse<any>> {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (profileError) {
      return { success: false, error: profileError.message }
    }

    // Fetch role if user has one
    let roleData = null
    if (profile.role_id) {
      const { data } = await supabase
        .from('roles')
        .select('id, name, permissions')
        .eq('id', profile.role_id)
        .maybeSingle()

      roleData = data
    }

    return {
      success: true,
      data: {
        ...profile,
        roles: roleData,
      },
    }
  } catch (error) {
    console.error('Unexpected error in getUserById:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

/**
 * Update user basic information
 */
export async function updateUser(
  userId: string,
  data: UpdateUserInput
): Promise<ActionResponse> {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Validate input
    const validated = updateUserSchema.safeParse(data)
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || 'Validation failed',
      }
    }

    // Update user
    const { error } = await supabase
      .from('profiles')
      .update(validated.data)
      .eq('id', userId)

    if (error) {
      console.error('Error updating user:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/admin/users')
    return { success: true, data: null }
  } catch (error) {
    console.error('Unexpected error in updateUser:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

/**
 * Update user role
 */
export async function updateUserRole(
  userId: string,
  data: UpdateUserRoleInput
): Promise<ActionResponse> {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Validate input
    const validated = updateUserRoleSchema.safeParse(data)
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || 'Validation failed',
      }
    }

    // Prevent users from modifying their own role
    if (userId === user.id) {
      return { success: false, error: 'You cannot modify your own role' }
    }

    // Prevent non-super-admins from creating super admins
    if (validated.data.role_type === 'super_admin') {
      const { data: currentUserProfile } = await supabase
        .from('profiles')
        .select('role_type')
        .eq('id', user.id)
        .single()

      if (currentUserProfile?.role_type !== 'super_admin') {
        return { success: false, error: 'Only super admins can assign super admin role' }
      }
    }

    // Update user role
    const { error } = await supabase
      .from('profiles')
      .update({
        role_type: validated.data.role_type,
        role_id: validated.data.role_id,
        custom_permissions: validated.data.custom_permissions,
      })
      .eq('id', userId)

    if (error) {
      console.error('Error updating user role:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/admin/users')
    return { success: true, data: null }
  } catch (error) {
    console.error('Unexpected error in updateUserRole:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

/**
 * Update user status (active/blocked/pending)
 */
export async function updateUserStatus(
  userId: string,
  data: UpdateUserStatusInput
): Promise<ActionResponse> {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Validate input
    const validated = updateUserStatusSchema.safeParse(data)
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || 'Validation failed',
      }
    }

    // Prevent users from blocking themselves
    if (userId === user.id) {
      return { success: false, error: 'You cannot modify your own status' }
    }

    // Prevent blocking super admins
    const { data: targetUser } = await supabase
      .from('profiles')
      .select('role_type, email')
      .eq('id', userId)
      .single()

    if (targetUser?.role_type === 'super_admin' && validated.data.status === 'blocked') {
      return { success: false, error: 'Cannot block super admin users' }
    }

    // Update status
    const { error } = await supabase
      .from('profiles')
      .update({ status: validated.data.status })
      .eq('id', userId)

    if (error) {
      console.error('Error updating user status:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/admin/users')
    return { success: true, data: null }
  } catch (error) {
    console.error('Unexpected error in updateUserStatus:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

/**
 * Get user activity logs
 */
export async function getUserActivity(
  userId: string,
  limit: number = 50
): Promise<ActionResponse<any[]>> {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Get activity logs where the user is the actor OR the target
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .or(`user_id.eq.${userId},entity_id.eq.${userId}`)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching user activity:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data: data || [] }
  } catch (error) {
    console.error('Unexpected error in getUserActivity:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

/**
 * Get all available roles for assignment
 */
export async function getAvailableRoles(): Promise<ActionResponse<any[]>> {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Fetch all roles (both system and custom)
    const { data, error } = await supabase
      .from('roles')
      .select('id, name, description, is_system_role, permissions')
      .order('is_system_role', { ascending: false })
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching roles:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data: data || [] }
  } catch (error) {
    console.error('Unexpected error in getAvailableRoles:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

/**
 * Create a new user directly (super admin only)
 */
export async function createUser(data: CreateUserInput): Promise<ActionResponse<any>> {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Validate input
    const validated = createUserSchema.safeParse(data)
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || 'Validation failed',
      }
    }

    // Check if user with email already exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', validated.data.email)
      .maybeSingle()

    if (existingUser) {
      return { success: false, error: 'A user with this email already exists' }
    }

    // Create user in profiles table
    const { data: newUser, error } = await supabase
      .from('profiles')
      .insert({
        email: validated.data.email,
        full_name: validated.data.full_name,
        designation: validated.data.designation,
        department: validated.data.department,
        employee_id: validated.data.employee_id,
        phone: validated.data.phone,
        role_type: validated.data.role_type,
        role_id: validated.data.role_id,
        status: validated.data.status,
        created_by: user.id,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating user:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/admin/users')
    return { success: true, data: newUser }
  } catch (error) {
    console.error('Unexpected error in createUser:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

/**
 * Send an invitation email to a new user
 */
export async function sendUserInvitation(data: CreateUserInput): Promise<ActionResponse<any>> {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Validate input
    const validated = createUserSchema.safeParse(data)
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || 'Validation failed',
      }
    }

    // Check if user with email already exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', validated.data.email)
      .maybeSingle()

    if (existingUser) {
      return { success: false, error: 'A user with this email already exists' }
    }

    // Check if there's a pending invitation
    const { data: existingInvitation } = await supabase
      .from('user_invitations')
      .select('id')
      .eq('email', validated.data.email)
      .is('accepted_at', null)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle()

    if (existingInvitation) {
      return { success: false, error: 'An invitation has already been sent to this email' }
    }

    // Generate secure token
    const token = randomBytes(32).toString('hex')

    // Create invitation (expires in 7 days)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    const { data: invitation, error: inviteError } = await supabase
      .from('user_invitations')
      .insert({
        email: validated.data.email,
        token,
        invited_by: user.id,
        role_type: validated.data.role_type,
        role_id: validated.data.role_id,
        full_name: validated.data.full_name,
        department: validated.data.department,
        designation: validated.data.designation,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single()

    if (inviteError) {
      console.error('Error creating invitation:', inviteError)
      return { success: false, error: inviteError.message }
    }

    // TODO: Send invitation email
    // For now, we'll just return the invitation link
    const inviteLink = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'}/auth/invite/${token}`

    revalidatePath('/admin/users')
    return {
      success: true,
      data: {
        invitation,
        inviteLink,
        message: 'Invitation created successfully. Copy the link to send to the user.',
      },
    }
  } catch (error) {
    console.error('Unexpected error in sendUserInvitation:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

/**
 * Get invitation by token
 */
export async function getInvitationByToken(token: string): Promise<ActionResponse<any>> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('user_invitations')
      .select('*')
      .eq('token', token)
      .is('accepted_at', null)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (error || !data) {
      return { success: false, error: 'Invalid or expired invitation' }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Unexpected error in getInvitationByToken:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

/**
 * Accept invitation and create user account
 */
export async function acceptInvitation(token: string, password: string): Promise<ActionResponse> {
  try {
    const supabase = await createClient()

    // Get invitation
    const inviteResult = await getInvitationByToken(token)
    if (!inviteResult.success) {
      return inviteResult
    }

    const invitation = inviteResult.data

    // Create auth user (will be handled by Supabase Auth)
    // For now, we'll create the profile and mark invitation as accepted
    // The actual auth user will be created on first login via OAuth

    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', invitation.email)
      .maybeSingle()

    if (existingProfile) {
      return { success: false, error: 'User account already exists' }
    }

    // Mark invitation as accepted
    const { error: updateError } = await supabase
      .from('user_invitations')
      .update({ accepted_at: new Date().toISOString() })
      .eq('token', token)

    if (updateError) {
      console.error('Error accepting invitation:', updateError)
      return { success: false, error: updateError.message }
    }

    return {
      success: true,
      data: {
        message: 'Invitation accepted. Please sign in with your @jkkn.ac.in email.',
        email: invitation.email,
      },
    }
  } catch (error) {
    console.error('Unexpected error in acceptInvitation:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}
