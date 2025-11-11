/**
 * API Route: Sync Institutions
 * Fetches institutions from external API and syncs to database
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface ExternalInstitution {
  id: string
  name: string
  counselling_code: string | null
  category: string | null
  institution_type: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

interface ExternalApiResponse {
  data: ExternalInstitution[]
  metadata?: {
    page: number
    totalPages: number
    total: number
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role_type')
      .eq('id', user.id)
      .single()

    if (!profile || !['super_admin', 'custom_role'].includes(profile.role_type)) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    // Get API key from request body or environment
    const body = await request.json()
    const apiKey = body.apiKey || process.env.JKKN_API_KEY

    console.log('[INSTITUTIONS SYNC] Environment check:')
    console.log('- JKKN_API_KEY from env:', process.env.JKKN_API_KEY ? '✓ Found' : '✗ Not found')
    console.log('- apiKey from body:', body.apiKey ? 'Provided' : 'Not provided')
    console.log('- Final apiKey:', apiKey ? `${apiKey.substring(0, 15)}...` : 'MISSING')

    if (!apiKey) {
      console.error('[INSTITUTIONS SYNC] No API key available')
      return NextResponse.json(
        { success: false, error: 'API key is required' },
        { status: 400 }
      )
    }

    // Fetch institutions from external API
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://www.jkkn.ai'
    const endpoint = '/api/api-management/organizations/institutions'
    const url = `${baseUrl}${endpoint}`

    console.log('[INSTITUTIONS SYNC] Attempting to fetch from:', url)
    console.log('[INSTITUTIONS SYNC] Using API key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'MISSING')

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    })

    console.log('[INSTITUTIONS SYNC] Response status:', response.status, response.statusText)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[INSTITUTIONS SYNC] Error response:', errorText)

      return NextResponse.json(
        {
          success: false,
          error: `External API request failed: ${response.status} ${response.statusText}`,
          details: {
            url,
            status: response.status,
            statusText: response.statusText,
            errorBody: errorText
          }
        },
        { status: response.status }
      )
    }

    const apiData: ExternalApiResponse = await response.json()

    console.log('[INSTITUTIONS SYNC] Received', apiData.data?.length || 0, 'institutions from API')

    if (!apiData.data || !Array.isArray(apiData.data)) {
      return NextResponse.json(
        { success: false, error: 'Invalid data format from external API' },
        { status: 500 }
      )
    }

    // Sync institutions to database (upsert)
    const institutionsToSync = apiData.data.map((inst) => ({
      institution_id: inst.id,
      name: inst.name,
      counselling_code: inst.counselling_code,
      category: inst.category,
      institution_type: inst.institution_type,
      is_active: inst.is_active,
      api_created_at: inst.created_at,
      api_updated_at: inst.updated_at,
      updated_at: new Date().toISOString(),
    }))

    // Use upsert to insert or update
    const { data: syncedData, error: syncError } = await supabase
      .from('institutions')
      .upsert(institutionsToSync, {
        onConflict: 'institution_id',
        ignoreDuplicates: false,
      })
      .select('id, institution_id, name')

    if (syncError) {
      console.error('[INSTITUTIONS SYNC] Database error:', syncError)
      return NextResponse.json(
        { success: false, error: `Failed to sync institutions: ${syncError.message}` },
        { status: 500 }
      )
    }

    console.log('[INSTITUTIONS SYNC] Successfully synced', syncedData?.length || institutionsToSync.length, 'institutions to database')

    return NextResponse.json({
      success: true,
      data: {
        synced: syncedData?.length || institutionsToSync.length,
        total: apiData.metadata?.total || apiData.data.length,
        institutions: syncedData,
      },
    })

  } catch (error) {
    console.error('Error syncing institutions:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      },
      { status: 500 }
    )
  }
}
