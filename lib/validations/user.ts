/**
 * Validation schemas for user management operations
 * Uses Zod for type-safe validation
 */

import { z } from 'zod'

// Base email validation for JKKN domain
const jkknEmailSchema = z
  .string()
  .email('Please enter a valid email address')
  .refine(
    (email) => email.endsWith('@jkkn.ac.in'),
    'Only @jkkn.ac.in email addresses are allowed'
  )

// Update user profile schema
export const updateUserSchema = z.object({
  full_name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .optional(),

  designation: z
    .string()
    .max(100, 'Designation must not exceed 100 characters')
    .optional()
    .nullable(),

  department: z
    .string()
    .max(100, 'Department must not exceed 100 characters')
    .optional()
    .nullable(),

  employee_id: z
    .string()
    .max(50, 'Employee ID must not exceed 50 characters')
    .optional()
    .nullable(),

  phone: z
    .string()
    .regex(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .optional()
    .nullable(),
})

// Update user role schema
export const updateUserRoleSchema = z.object({
  role_type: z.enum(['user', 'custom_role', 'super_admin']),

  role_id: z
    .string()
    .uuid('Invalid role ID')
    .nullable()
    .optional(),

  custom_permissions: z
    .record(
      z.string(),
      z.record(z.string(), z.boolean())
    )
    .nullable()
    .optional(),
}).refine(
  (data) => {
    // If role_type is custom_role, either role_id or custom_permissions must be provided
    if (data.role_type === 'custom_role') {
      return data.role_id !== null || data.custom_permissions !== null
    }
    return true
  },
  {
    message: 'Custom role requires either a role_id or custom_permissions',
    path: ['role_id'],
  }
)

// Update user status schema
export const updateUserStatusSchema = z.object({
  status: z.enum(['active', 'blocked', 'pending']),
})

// Create user schema (for future use in Phase 3)
export const createUserSchema = z.object({
  email: jkknEmailSchema,

  full_name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),

  designation: z
    .string()
    .max(100, 'Designation must not exceed 100 characters')
    .optional()
    .nullable(),

  department: z
    .string()
    .max(100, 'Department must not exceed 100 characters')
    .optional()
    .nullable(),

  employee_id: z
    .string()
    .max(50, 'Employee ID must not exceed 50 characters')
    .optional()
    .nullable(),

  phone: z
    .string()
    .regex(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .optional()
    .nullable(),

  role_type: z.enum(['user', 'custom_role']).default('user'),

  role_id: z
    .string()
    .uuid('Invalid role ID')
    .nullable()
    .optional(),

  status: z.enum(['active', 'pending', 'blocked']).default('pending'),
}).refine(
  (data) => {
    if (data.role_type === 'custom_role') {
      return !!data.role_id
    }
    return true
  },
  {
    message: 'role_id is required when role_type is custom_role',
    path: ['role_id'],
  }
)

// Bulk user operations schema
export const bulkUserOperationSchema = z.object({
  user_ids: z.array(z.string().uuid()).min(1, 'At least one user must be selected'),
  operation: z.enum(['assign_role', 'change_status', 'delete']),

  // For assign_role operation
  role_id: z.string().uuid().optional().nullable(),
  role_type: z.enum(['user', 'custom_role']).optional(),

  // For change_status operation
  status: z.enum(['active', 'blocked', 'pending']).optional(),
}).refine(
  (data) => {
    if (data.operation === 'assign_role') {
      return data.role_type !== undefined
    }
    return true
  },
  {
    message: 'role_type is required for assign_role operation',
    path: ['role_type'],
  }
).refine(
  (data) => {
    if (data.operation === 'assign_role' && data.role_type === 'custom_role') {
      return !!data.role_id
    }
    return true
  },
  {
    message: 'role_id is required when assigning custom_role',
    path: ['role_id'],
  }
).refine(
  (data) => {
    if (data.operation === 'change_status') {
      return data.status !== undefined
    }
    return true
  },
  {
    message: 'status is required for change_status operation',
    path: ['status'],
  }
)

// Export TypeScript types
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>
export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema>
export type CreateUserInput = z.infer<typeof createUserSchema>
export type BulkUserOperationInput = z.infer<typeof bulkUserOperationSchema>
