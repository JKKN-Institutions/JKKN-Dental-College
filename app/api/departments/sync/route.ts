/**
 * API Route: Sync Departments
 * Fetches departments from external API and syncs to database
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface ExternalDepartment {
  id: string
  department_name: string
  department_code: string | null
  institution_id: string
  is_active: boolean
  created_at: string
  updated_at: string
}

interface ExternalApiResponse {
  data: ExternalDepartment[]
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

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'API key is required' },
        { status: 400 }
      )
    }

    // Fetch ALL departments from external API with pagination
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://www.jkkn.ai'
    const endpoint = '/api/api-management/organizations/departments'

    let allDepartments: ExternalDepartment[] = []
    let currentPage = 1
    let totalPages = 1

    // Fetch all pages
    do {
      const url = `${baseUrl}${endpoint}?page=${currentPage}`

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
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

      if (!apiData.data || !Array.isArray(apiData.data)) {
        return NextResponse.json(
          { success: false, error: 'Invalid data format from external API' },
          { status: 500 }
        )
      }

      allDepartments = allDepartments.concat(apiData.data)

      if (apiData.metadata) {
        totalPages = apiData.metadata.totalPages
      }

      currentPage++
    } while (currentPage <= totalPages)

    // Get institution mapping (external ID -> internal UUID)
    const { data: institutions } = await supabase
      .from('institutions')
      .select('id, institution_id')

    const institutionMap = new Map(
      institutions?.map(inst => [inst.institution_id, inst.id]) || []
    )

    // Sync departments to database (upsert)
    const departmentsToSync = allDepartments
      .filter(dept => {
        const hasInstitution = institutionMap.has(dept.institution_id)
        const hasName = !!dept.department_name
        return hasInstitution && hasName
      })
      .map((dept) => ({
        department_id: dept.id,
        name: dept.department_name,
        code: dept.department_code,
        institution_id: institutionMap.get(dept.institution_id)!,
        is_active: dept.is_active,
        api_created_at: dept.created_at,
        api_updated_at: dept.updated_at,
        updated_at: new Date().toISOString(),
      }))

    if (departmentsToSync.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          synced: 0,
          total: allDepartments.length,
          message: 'No departments to sync. Make sure institutions are synced first.',
        },
      })
    }

    // Use upsert to insert or update
    const { data: syncedData, error: syncError } = await supabase
      .from('departments')
      .upsert(departmentsToSync, {
        onConflict: 'department_id',
        ignoreDuplicates: false,
      })
      .select('id, department_id, name')

    if (syncError) {
      return NextResponse.json(
        { success: false, error: `Failed to sync departments: ${syncError.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        synced: syncedData?.length || departmentsToSync.length,
        total: allDepartments.length,
        totalPages: totalPages,
        departments: syncedData,
      },
    })

  } catch (error) {
    console.error('Error syncing departments:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      },
      { status: 500 }
    )
  }
}
