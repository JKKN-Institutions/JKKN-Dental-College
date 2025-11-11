/**
 * ApiFetcher Component
 * Generic component to fetch data from external API with API key authentication
 */

'use client'

import { useEffect, useState } from 'react'
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ApiFetcherProps {
  endpoint: string
  apiKey: string
  onDataReceived?: (data: unknown) => void
  onError?: (error: string) => void
  autoFetch?: boolean
}

export function ApiFetcher({
  endpoint,
  apiKey,
  onDataReceived,
  onError,
  autoFetch = true,
}: ApiFetcherProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    if (!endpoint || !apiKey) {
      const errorMsg = 'Endpoint and API key are required'
      setError(errorMsg)
      onError?.(errorMsg)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.jkkn.ac.in'
      const url = `${baseUrl}${endpoint}`

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
        },
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      onDataReceived?.(data)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch data'
      setError(errorMsg)
      onError?.(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (autoFetch) {
      fetchData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, apiKey, autoFetch])

  if (!loading && !error) {
    return null
  }

  return (
    <div className="space-y-2">
      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Fetching data...</span>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-between gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={fetchData}
            disabled={loading}
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Retry
          </Button>
        </div>
      )}
    </div>
  )
}
