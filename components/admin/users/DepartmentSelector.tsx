/**
 * DepartmentSelector Component
 * Dropdown selector for departments filtered by institution with API sync functionality
 */

'use client'

import { useState, useEffect } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface Department {
  id: string
  department_id: string
  name: string
  code: string | null
  institution_id: string
  is_active: boolean
}

interface DepartmentSelectorProps {
  value: string | null
  onChange: (value: string | null) => void
  institutionId: string | null
  label?: string
  required?: boolean
  disabled?: boolean
}

export function DepartmentSelector({
  value,
  onChange,
  institutionId,
  label = 'Department',
  required = false,
  disabled = false,
}: DepartmentSelectorProps) {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(false)
  const [syncing, setSyncing] = useState(false)

  const loadDepartments = async (autoSyncIfEmpty = false) => {
    // Reset if no institution selected
    if (!institutionId) {
      setDepartments([])
      onChange(null)
      return
    }

    setLoading(true)
    try {
      console.log('[DepartmentSelector] Loading departments for institution:', institutionId)
      const response = await fetch(`/api/departments?onlyActive=true&institutionId=${institutionId}`, {
        credentials: 'include', // Include cookies for authentication
      })
      const result = await response.json()

      console.log('[DepartmentSelector] Response:', result)

      if (result.success) {
        console.log('[DepartmentSelector] Found departments:', result.data.length)
        setDepartments(result.data)

        // Clear selected department if it's not in the new list
        if (value && !result.data.find((d: Department) => d.id === value)) {
          onChange(null)
        }

        // Auto-sync if no departments found and autoSync is enabled
        if (autoSyncIfEmpty && result.data.length === 0) {
          console.log('No departments found, auto-syncing...')
          toast.loading('Fetching departments from server...')
          await syncDepartments(true)
          toast.success('Departments loaded successfully!')
        }
      } else {
        console.error('[DepartmentSelector] Error:', result.error)
        toast.error(result.error || 'Failed to load departments')
      }
    } catch (error) {
      console.error('[DepartmentSelector] Exception:', error)
      toast.error('Failed to load departments')
    } finally {
      setLoading(false)
    }
  }

  const syncDepartments = async (silent = false) => {
    setSyncing(true)
    try {
      const response = await fetch('/api/departments/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })

      const result = await response.json()

      if (result.success) {
        if (!silent) {
          toast.success(`Synced ${result.data.synced} departments`)
        }
        // Reload departments (without auto-sync to avoid infinite loop)
        await loadDepartments(false)
      } else {
        toast.error(result.error || 'Failed to sync departments')
      }
    } catch (error) {
      toast.error('Failed to sync departments')
    } finally {
      setSyncing(false)
    }
  }

  useEffect(() => {
    // Auto-sync departments if the database is empty for this institution
    loadDepartments(true)
  }, [institutionId])

  const isDisabled = disabled || loading || !institutionId

  return (
    <div className="space-y-2">
      <Label>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>

      <Select
        value={value || '__none__'}
        onValueChange={(val) => onChange(val === '__none__' ? null : val)}
        disabled={isDisabled}
      >
        <SelectTrigger>
          <SelectValue
            placeholder={
              !institutionId
                ? "Select institution first"
                : "Select department (optional)"
            }
          />
        </SelectTrigger>
        <SelectContent className="max-h-[300px] overflow-y-auto" position="popper" sideOffset={5}>
          <SelectItem value="__none__">None</SelectItem>
          {departments.map((department) => (
            <SelectItem key={department.id} value={department.id}>
              {department.name} {department.code && `(${department.code})`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {!institutionId && (
        <p className="text-xs text-muted-foreground">
          Please select an institution first to load departments
        </p>
      )}

      {institutionId && departments.length === 0 && !loading && (
        <p className="text-xs text-muted-foreground">
          No departments available. Click sync to fetch from API.
        </p>
      )}
    </div>
  )
}
