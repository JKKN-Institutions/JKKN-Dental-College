/**
 * Storage Service
 * Handles file uploads, deletions, and URL generation for Supabase Storage
 */

import { createClient } from '@/lib/supabase/client'

// Allowed file types
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

// File size limits (in bytes)
const MAX_ACTIVITY_IMAGE_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_AVATAR_SIZE = 2 * 1024 * 1024 // 2MB

// Storage bucket names
export const STORAGE_BUCKETS = {
  ACTIVITY_IMAGES: 'activity-images',
  TESTIMONIAL_AVATARS: 'testimonial-avatars',
} as const

export type StorageBucket = typeof STORAGE_BUCKETS[keyof typeof STORAGE_BUCKETS]

/**
 * File validation error
 */
export class FileValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'FileValidationError'
  }
}

/**
 * Validate file type
 */
function validateFileType(file: File): void {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new FileValidationError(
      `Invalid file type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`
    )
  }
}

/**
 * Validate file size
 */
function validateFileSize(file: File, maxSize: number): void {
  if (file.size > maxSize) {
    const maxSizeMB = maxSize / (1024 * 1024)
    throw new FileValidationError(
      `File size exceeds ${maxSizeMB}MB limit. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`
    )
  }
}

/**
 * Generate unique filename
 */
function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 8)
  const extension = originalName.split('.').pop()
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '')
  const sanitizedName = nameWithoutExt
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50)

  return `${sanitizedName}-${timestamp}-${randomString}.${extension}`
}

/**
 * Upload image to storage bucket
 *
 * @param file - File to upload
 * @param bucket - Storage bucket name
 * @param folder - Optional folder path within bucket
 * @returns Public URL of uploaded file
 */
export async function uploadImage(
  file: File,
  bucket: StorageBucket,
  folder?: string
): Promise<string> {
  try {
    // Validate file type
    validateFileType(file)

    // Validate file size based on bucket
    const maxSize = bucket === STORAGE_BUCKETS.ACTIVITY_IMAGES
      ? MAX_ACTIVITY_IMAGE_SIZE
      : MAX_AVATAR_SIZE
    validateFileSize(file, maxSize)

    // Generate unique filename
    const fileName = generateUniqueFileName(file.name)
    const filePath = folder ? `${folder}/${fileName}` : fileName

    // Upload to Supabase Storage
    const supabase = createClient()
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      console.error('[StorageService] Upload error:', error)
      throw new Error(`Failed to upload file: ${error.message}`)
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)

    console.log('[StorageService] File uploaded successfully:', publicUrl)
    return publicUrl

  } catch (error) {
    if (error instanceof FileValidationError) {
      throw error
    }
    console.error('[StorageService] Unexpected upload error:', error)
    throw new Error('An unexpected error occurred during file upload')
  }
}

/**
 * Upload multiple images
 *
 * @param files - Array of files to upload
 * @param bucket - Storage bucket name
 * @param folder - Optional folder path within bucket
 * @returns Array of public URLs
 */
export async function uploadMultipleImages(
  files: File[],
  bucket: StorageBucket,
  folder?: string
): Promise<string[]> {
  const uploadPromises = files.map(file => uploadImage(file, bucket, folder))
  return Promise.all(uploadPromises)
}

/**
 * Delete file from storage
 *
 * @param url - Public URL of the file to delete
 * @param bucket - Storage bucket name
 * @returns true if successful
 */
export async function deleteFile(
  url: string,
  bucket: StorageBucket
): Promise<boolean> {
  try {
    // Extract file path from URL
    const urlParts = url.split(`/${bucket}/`)
    if (urlParts.length < 2) {
      throw new Error('Invalid file URL')
    }
    const filePath = urlParts[1]

    // Delete from Supabase Storage
    const supabase = createClient()
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath])

    if (error) {
      console.error('[StorageService] Delete error:', error)
      throw new Error(`Failed to delete file: ${error.message}`)
    }

    console.log('[StorageService] File deleted successfully:', filePath)
    return true

  } catch (error) {
    console.error('[StorageService] Unexpected delete error:', error)
    throw new Error('An unexpected error occurred during file deletion')
  }
}

/**
 * Delete multiple files from storage
 *
 * @param urls - Array of public URLs to delete
 * @param bucket - Storage bucket name
 * @returns true if all deletions successful
 */
export async function deleteMultipleFiles(
  urls: string[],
  bucket: StorageBucket
): Promise<boolean> {
  try {
    // Extract file paths from URLs
    const filePaths = urls.map(url => {
      const urlParts = url.split(`/${bucket}/`)
      if (urlParts.length < 2) {
        throw new Error(`Invalid file URL: ${url}`)
      }
      return urlParts[1]
    })

    // Delete from Supabase Storage
    const supabase = createClient()
    const { error } = await supabase.storage
      .from(bucket)
      .remove(filePaths)

    if (error) {
      console.error('[StorageService] Batch delete error:', error)
      throw new Error(`Failed to delete files: ${error.message}`)
    }

    console.log('[StorageService] Files deleted successfully:', filePaths.length)
    return true

  } catch (error) {
    console.error('[StorageService] Unexpected batch delete error:', error)
    throw new Error('An unexpected error occurred during batch file deletion')
  }
}

/**
 * Get public URL for a file (without uploading)
 * Useful for getting URL of already uploaded file
 *
 * @param filePath - Path to file in bucket
 * @param bucket - Storage bucket name
 * @returns Public URL
 */
export function getPublicUrl(
  filePath: string,
  bucket: StorageBucket
): string {
  const supabase = createClient()
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath)

  return publicUrl
}

/**
 * Check if file exists in storage
 *
 * @param filePath - Path to file in bucket
 * @param bucket - Storage bucket name
 * @returns true if file exists
 */
export async function fileExists(
  filePath: string,
  bucket: StorageBucket
): Promise<boolean> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(filePath.split('/').slice(0, -1).join('/'), {
        search: filePath.split('/').pop(),
      })

    if (error) {
      return false
    }

    return data && data.length > 0

  } catch (error) {
    console.error('[StorageService] File exists check error:', error)
    return false
  }
}

/**
 * Helper: Convert File to base64 for preview
 *
 * @param file - File to convert
 * @returns Base64 string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}

/**
 * Helper: Get file size in human-readable format
 *
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "2.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}
