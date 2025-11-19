/**
 * API Route: Get Departments
 * Returns list of departments from database, optionally filtered by institution
 */

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    // Use admin client to bypass RLS for client-side requests
    const supabase = createAdminClient()

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const onlyActive = searchParams.get('onlyActive') !== 'false' // Default to true
    const institutionId = searchParams.get('institutionId')

    console.log('[API /api/departments] Fetching departments for institution:', institutionId || 'all')

    // Build query
    let query = supabase
      .from('departments')
      .select('id, department_id, name, code, institution_id, is_active')
      .order('name', { ascending: true })

    if (onlyActive) {
      query = query.eq('is_active', true)
    }

    if (institutionId) {
      query = query.eq('institution_id', institutionId)
    }

    const { data, error } = await query

    if (error) {
      console.error('[API /api/departments] Error:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    console.log('[API /api/departments] Success, found:', data?.length || 0, 'departments')

    return NextResponse.json({
      success: true,
      data: data || [],
    })

  } catch (error) {
    console.error('[API /api/departments] Exception:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      },
      { status: 500 }
    )
  }
}
