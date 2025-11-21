/**
 * Image Compression Utility
 * Compresses images before upload to reduce file size and improve upload speed
 */

export interface CompressionOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  maxSizeMB?: number
}

/**
 * Compress image file before upload
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
    quality = 0.8,
    maxSizeMB = 2,
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

  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const img = new Image()

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img

        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }

        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }

        // Create canvas and compress
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Failed to get canvas context'))
          return
        }

        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'))
              return
            }

            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            })

            console.log('[ImageCompression] Compression complete!', {
              originalSize: (file.size / (1024 * 1024)).toFixed(2) + 'MB',
              compressedSize: (compressedFile.size / (1024 * 1024)).toFixed(2) + 'MB',
              reduction: ((1 - compressedFile.size / file.size) * 100).toFixed(1) + '%',
            })

            resolve(compressedFile)
          },
          file.type,
          quality
        )
      }

      img.onerror = () => {
        reject(new Error('Failed to load image'))
      }

      img.src = e.target?.result as string
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsDataURL(file)
  })
}
