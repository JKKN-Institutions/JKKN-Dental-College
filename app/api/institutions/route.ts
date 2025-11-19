/**
 * API Route: Get Institutions
 * Returns list of institutions from database
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient as createBrowserClient } from '@/lib/supabase/client'

export async function GET(request: NextRequest) {
  try {
    // Use server client for server-side rendering
    const supabase = await createServerClient()

    // Check authentication - but don't block if called from client
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    // If no user, this might be a client-side call, so try that too
    if (!user) {
      console.log('[API] No server session, allowing request to proceed')
    }

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
