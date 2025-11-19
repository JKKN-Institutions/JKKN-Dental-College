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
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RefreshCw, Loader2, Download } from 'lucide-react'
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
      const response = await fetch('/api/institutions?onlyActive=true')
      const result = await response.json()

      if (result.success) {
        setInstitutions(result.data)

        // Auto-sync if no institutions found and autoSync is enabled
        if (autoSyncIfEmpty && result.data.length === 0) {
          console.log('No institutions found, auto-syncing...')
          toast.loading('Fetching institutions from server...')
          await syncInstitutions(true)
          toast.success('Institutions loaded successfully!')
        }
      } else {
        toast.error(result.error || 'Failed to load institutions')
      }
    } catch (error) {
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

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => loadInstitutions()}
            disabled={loading || syncing || disabled}
            title="Refresh list"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => syncInstitutions()}
            disabled={loading || syncing || disabled}
            title="Sync from API"
          >
            {syncing ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Download className="w-3 h-3" />
            )}
          </Button>
        </div>
      </div>

      <Select
        value={value || '__none__'}
        onValueChange={(val) => onChange(val === '__none__' ? null : val)}
        disabled={disabled || loading}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select institution (optional)" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px] overflow-y-auto">
          <SelectItem value="__none__">None</SelectItem>
          {institutions.map((institution) => (
            <SelectItem key={institution.id} value={institution.id}>
              {institution.name}
            </SelectItem>
          ))}
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
