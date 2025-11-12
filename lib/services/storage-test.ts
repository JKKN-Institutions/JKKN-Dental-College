/**
 * Storage Connection Test
 * Quick test to verify Supabase storage is accessible
 */

import { createClient } from '@/lib/supabase/client'

export async function testStorageConnection(): Promise<{
  success: boolean
  message: string
  details?: any
}> {
  try {
    console.log('[StorageTest] Testing Supabase storage connection...')

    const supabase = createClient()

    // List buckets to test connection
    const { data: buckets, error } = await supabase.storage.listBuckets()

    if (error) {
      console.error('[StorageTest] Error listing buckets:', error)
      return {
        success: false,
        message: `Storage connection failed: ${error.message}`,
        details: error
      }
    }

    console.log('[StorageTest] Successfully connected. Buckets found:', buckets)

    // Check for activity-images bucket
    const activityBucket = buckets?.find(b => b.name === 'activity-images')

    if (!activityBucket) {
      return {
        success: false,
        message: 'activity-images bucket not found',
        details: buckets
      }
    }

    // Try to list files in the bucket
    const { data: files, error: listError } = await supabase.storage
      .from('activity-images')
      .list('hero', {
        limit: 1,
      })

    if (listError) {
      console.error('[StorageTest] Error listing files:', listError)
      return {
        success: false,
        message: `Cannot list files in bucket: ${listError.message}`,
        details: listError
      }
    }

    console.log('[StorageTest] Successfully listed files:', files)

    return {
      success: true,
      message: 'Storage connection successful',
      details: { buckets, files }
    }

  } catch (error) {
    console.error('[StorageTest] Unexpected error:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
      details: error
    }
  }
}
