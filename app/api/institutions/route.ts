/**
 * API Route: Get Institutions
 * Returns list of institutions from database
 */

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    // Use admin client to bypass RLS for client-side requests
    const supabase = createAdminClient()

    console.log('[API /api/institutions] Fetching institutions...')

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const onlyActive = searchParams.get('onlyActive') !== 'false' // Default to true

    // Build query
    let query = supabase
      .from('institutions')
      .select('id, institution_id, name, counselling_code, is_active')
      .order('name', { ascending: true })

    if (onlyActive) {
      query = query.eq('is_active', true)
    }

    const { data, error } = await query

    if (error) {
      console.error('[API /api/institutions] Error:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    console.log('[API /api/institutions] Success, found:', data?.length || 0, 'institutions')

    return NextResponse.json({
      success: true,
      data: data || [],
    })

  } catch (error) {
    console.error('[API /api/institutions] Exception:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      },
      { status: 500 }
    )
  }
}
