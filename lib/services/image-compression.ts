/**
 * Image Compression Utility
 * Compresses images before upload to reduce file size and improve upload speed
 */

export interface CompressionOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  maxSizeMB?: number
  timeoutMs?: number
}

/**
 * Compress image file before upload with timeout protection
 * @param file - Original image file
 * @param options - Compression options
 * @returns Compressed image file
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.7, // Reduced from 0.8 for faster compression
    maxSizeMB = 2,
    timeoutMs = 15000, // 15 second timeout for compression
  } = options

  // Skip compression if file is already small
  if (file.size <= maxSizeMB * 1024 * 1024) {
    console.log('[ImageCompression] File size acceptable, skipping compression')
    return file
  }

  console.log('[ImageCompression] Starting compression...', {
    originalSize: (file.size / (1024 * 1024)).toFixed(2) + 'MB',
    maxWidth,
    maxHeight,
    quality,
  })

  // Create compression promise with timeout
  const compressionPromise = new Promise<File>((resolve, reject) => {
    // Use createObjectURL instead of readAsDataURL for faster loading
    const objectUrl = URL.createObjectURL(file)
    const img = new Image()

    img.onload = () => {
      try {
        // Calculate new dimensions
        let { width, height } = img

        // More aggressive resizing for large images
        const maxDimension = Math.max(maxWidth, maxHeight)
        if (width > maxDimension || height > maxDimension) {
          const scale = maxDimension / Math.max(width, height)
          width = Math.round(width * scale)
          height = Math.round(height * scale)
        }

        console.log('[ImageCompression] Resizing to:', { width, height })

        // Create canvas and compress
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          URL.revokeObjectURL(objectUrl)
          reject(new Error('Failed to get canvas context'))
          return
        }

        ctx.drawImage(img, 0, 0, width, height)

        // Use JPEG for better compression (unless it's PNG with transparency)
        const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
        const outputQuality = file.type === 'image/png' ? undefined : quality

        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(objectUrl)

            if (!blob) {
              reject(new Error('Failed to compress image'))
              return
            }

            // Generate new filename with correct extension
            const ext = outputType === 'image/jpeg' ? '.jpg' : '.png'
            const baseName = file.name.replace(/\.[^/.]+$/, '')
            const newFileName = baseName + ext

            const compressedFile = new File([blob], newFileName, {
              type: outputType,
              lastModified: Date.now(),
            })

            console.log('[ImageCompression] Compression complete!', {
              originalSize: (file.size / (1024 * 1024)).toFixed(2) + 'MB',
              compressedSize: (compressedFile.size / (1024 * 1024)).toFixed(2) + 'MB',
              reduction: ((1 - compressedFile.size / file.size) * 100).toFixed(1) + '%',
            })

            resolve(compressedFile)
          },
          outputType,
          outputQuality
        )
      } catch (error) {
        URL.revokeObjectURL(objectUrl)
        reject(error)
      }
    }

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Failed to load image'))
    }

    img.src = objectUrl
  })

  // Add timeout protection
  const timeoutPromise = new Promise<File>((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Image compression timed out after ${timeoutMs / 1000} seconds. Try a smaller image.`))
    }, timeoutMs)
  })

  return Promise.race([compressionPromise, timeoutPromise])
}
