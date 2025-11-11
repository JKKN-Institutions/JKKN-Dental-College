/**
 * API Route: Get Departments
 * Returns list of departments from database, optionally filtered by institution
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
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

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const onlyActive = searchParams.get('onlyActive') !== 'false' // Default to true
    const institutionId = searchParams.get('institutionId')

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
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: data || [],
    })

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      },
      { status: 500 }
    )
  }
}
