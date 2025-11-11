/**
 * Server Actions for Role Management
 * Handles CRUD operations for custom roles with permission checks
 */

'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import {
  createRoleSchema,
  updateRoleSchema,
  cloneRoleSchema,
  type CreateRoleInput,
  type UpdateRoleInput,
  type CloneRoleInput,
} from '@/lib/validations/role'

// Response types
type ActionResponse<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string }

/**
 * Get all roles (system and custom)
 */
export async function getRoles(): Promise<ActionResponse<any[]>> {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Fetch all roles
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .order('is_system_role', { ascending: false })
      .order('name', { ascending: true })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data: data || [] }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

/**
 * Get all roles with user counts (optimized single query)
 * Uses database function to fetch roles and their user counts in one query
 */
export async function getRolesWithUserCounts(): Promise<ActionResponse<any[]>> {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Call optimized database function
    const { data, error } = await supabase.rpc('get_roles_with_user_counts')

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data: data || [] }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

/**
 * Get a single role by ID
 */
export async function getRoleById(roleId: string): Promise<ActionResponse<any>> {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Unauthorized' }
    }

    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .eq('id', roleId)
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

/**
 * Create a new custom role
 */
export async function createRole(data: CreateRoleInput): Promise<ActionResponse<any>> {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Validate input
    const validated = createRoleSchema.safeParse(data)
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || 'Validation failed',
      }
    }

    // Check if role name already exists
    const { data: existingRole } = await supabase
      .from('roles')
      .select('id')
      .ilike('name', validated.data.name)
      .maybeSingle()

    if (existingRole) {
      return { success: false, error: 'A role with this name already exists' }
    }

    // Create role
    const { data: newRole, error } = await supabase
      .from('roles')
      .insert({
        name: validated.data.name,
        description: validated.data.description,
        permissions: validated.data.permissions,
        is_system_role: false,
        created_by: user.id,
      })
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/admin/roles')
    revalidatePath('/admin/users')
    return { success: true, data: newRole }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

/**
 * Update a custom role's permissions
 */
export async function updateRole(
  roleId: string,
  data: UpdateRoleInput
): Promise<ActionResponse> {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Validate input
    const validated = updateRoleSchema.safeParse(data)
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || 'Validation failed',
      }
    }

    // Check if role exists and is not a system role
    const { data: role } = await supabase
      .from('roles')
      .select('is_system_role')
      .eq('id', roleId)
      .single()

    if (!role) {
      return { success: false, error: 'Role not found' }
    }

    if (role.is_system_role) {
      return { success: false, error: 'Cannot modify system roles' }
    }

    // Check if new name conflicts with existing role (excluding current role)
    const { data: existingRole } = await supabase
      .from('roles')
      .select('id')
      .ilike('name', validated.data.name)
      .neq('id', roleId)
      .maybeSingle()

    if (existingRole) {
      return { success: false, error: 'A role with this name already exists' }
    }

    // Update role
    const { error } = await supabase
      .from('roles')
      .update({
        name: validated.data.name,
        description: validated.data.description,
        permissions: validated.data.permissions,
        updated_at: new Date().toISOString(),
      })
      .eq('id', roleId)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/admin/roles')
    revalidatePath('/admin/users')
    return { success: true, data: null }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

/**
 * Delete a custom role
 */
export async function deleteRole(roleId: string): Promise<ActionResponse> {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Check if role exists and is not a system role
    const { data: role } = await supabase
      .from('roles')
      .select('is_system_role')
      .eq('id', roleId)
      .single()

    if (!role) {
      return { success: false, error: 'Role not found' }
    }

    if (role.is_system_role) {
      return { success: false, error: 'Cannot delete system roles' }
    }

    // Check if any users are assigned to this role
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('id')
      .eq('role_id', roleId)
      .limit(1)

    if (usersError) {
      return { success: false, error: usersError.message }
    }

    if (users && users.length > 0) {
      // Get count of users with this role
      const { count } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('role_id', roleId)

      return {
        success: false,
        error: `Cannot delete role. ${count} user(s) are currently assigned to this role. Please reassign them first.`,
      }
    }

    // Delete role
    const { error } = await supabase
      .from('roles')
      .delete()
      .eq('id', roleId)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/admin/roles')
    revalidatePath('/admin/users')
    return { success: true, data: null }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

/**
 * Clone an existing role
 */
export async function cloneRole(data: CloneRoleInput): Promise<ActionResponse<any>> {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Validate input
    const validated = cloneRoleSchema.safeParse(data)
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || 'Validation failed',
      }
    }

    // Get source role
    const { data: sourceRole, error: sourceError } = await supabase
      .from('roles')
      .select('permissions')
      .eq('id', validated.data.source_role_id)
      .single()

    if (sourceError || !sourceRole) {
      return { success: false, error: 'Source role not found' }
    }

    // Check if new name conflicts with existing role
    const { data: existingRole } = await supabase
      .from('roles')
      .select('id')
      .ilike('name', validated.data.name)
      .maybeSingle()

    if (existingRole) {
      return { success: false, error: 'A role with this name already exists' }
    }

    // Create cloned role
    const { data: newRole, error } = await supabase
      .from('roles')
      .insert({
        name: validated.data.name,
        description: validated.data.description,
        permissions: sourceRole.permissions,
        is_system_role: false,
        created_by: user.id,
      })
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/admin/roles')
    return { success: true, data: newRole }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

/**
 * Get count of users assigned to a role
 */
export async function getRoleUserCount(roleId: string): Promise<ActionResponse<number>> {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Unauthorized' }
    }

    const { count, error } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('role_id', roleId)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data: count || 0 }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}
