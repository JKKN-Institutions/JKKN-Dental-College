/**
 * InstitutionSelector Component
 * Dropdown selector for institutions with API sync functionality
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

interface Institution {
  id: string
  institution_id: string
  name: string
  is_active: boolean
}

interface InstitutionSelectorProps {
  value: string | null
  onChange: (value: string | null) => void
  label?: string
  required?: boolean
  disabled?: boolean
}

export function InstitutionSelector({
  value,
  onChange,
  label = 'Institution',
  required = false,
  disabled = false,
}: InstitutionSelectorProps) {
  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [loading, setLoading] = useState(false)
  const [syncing, setSyncing] = useState(false)

  const loadInstitutions = async (autoSyncIfEmpty = false) => {
    setLoading(true)
    try {
      console.log('[InstitutionSelector] Loading institutions...')
      const response = await fetch('/api/institutions?onlyActive=true', {
        credentials: 'include', // Include cookies for authentication
      })
      const result = await response.json()

      console.log('[InstitutionSelector] Response:', result)
      console.log('[InstitutionSelector] Result.success:', result.success)
      console.log('[InstitutionSelector] Result.data:', result.data)

      if (result.success) {
        console.log('[InstitutionSelector] Found institutions:', result.data.length)
        console.log('[InstitutionSelector] Setting institutions state with:', result.data)
        setInstitutions(result.data)
        console.log('[InstitutionSelector] State updated')

        // Auto-sync if no institutions found and autoSync is enabled
        if (autoSyncIfEmpty && result.data.length === 0) {
          console.log('No institutions found, auto-syncing...')
          toast.loading('Fetching institutions from server...')
          await syncInstitutions(true)
          toast.success('Institutions loaded successfully!')
        }
      } else {
        console.error('[InstitutionSelector] Error:', result.error)
        toast.error(result.error || 'Failed to load institutions')
      }
    } catch (error) {
      console.error('[InstitutionSelector] Exception:', error)
      toast.error('Failed to load institutions')
    } finally {
      setLoading(false)
    }
  }

  const syncInstitutions = async (silent = false) => {
    setSyncing(true)
    try {
      const response = await fetch('/api/institutions/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })

      const result = await response.json()

      if (result.success) {
        if (!silent) {
          toast.success(`Synced ${result.data.synced} institutions`)
        }
        // Reload institutions (without auto-sync to avoid infinite loop)
        await loadInstitutions(false)
      } else {
        toast.error(result.error || 'Failed to sync institutions')
      }
    } catch (error) {
      toast.error('Failed to sync institutions')
    } finally {
      setSyncing(false)
    }
  }

  useEffect(() => {
    // Auto-sync institutions if the database is empty
    loadInstitutions(true)
  }, [])

  // Debug: Log institutions state on every render
  console.log('[InstitutionSelector] Rendering with institutions:', institutions.length, institutions)
  console.log('[InstitutionSelector] Props - value:', value, 'disabled:', disabled, 'loading:', loading)
  console.log('[InstitutionSelector] Select disabled state:', disabled || loading)

  return (
    <div className="space-y-2">
      <Label>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>

      <Select
        value={value || '__none__'}
        onValueChange={(val) => {
          console.log('[InstitutionSelector] Value changed to:', val)
          onChange(val === '__none__' ? null : val)
        }}
        disabled={disabled || loading}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select institution (optional)" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px] overflow-y-auto" position="popper" sideOffset={5}>
          <SelectItem value="__none__">None</SelectItem>
          {institutions.map((institution) => {
            console.log('[InstitutionSelector] Mapping institution:', institution)
            return (
              <SelectItem key={institution.id} value={institution.id}>
                {institution.name}
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>

      {institutions.length === 0 && !loading && (
        <p className="text-xs text-muted-foreground">
          No institutions available. Click sync to fetch from API.
        </p>
      )}
    </div>
  )
}
