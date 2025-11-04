import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'JKKN Institution',
    short_name: 'JKKN',
    description: 'Leading educational institution offering quality education with state-of-the-art facilities',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#187041',
    orientation: 'any',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
