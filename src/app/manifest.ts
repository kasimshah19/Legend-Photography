import { MetadataRoute } from 'next'
import { getSiteSettings } from '@/lib/getSiteSettings'

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await getSiteSettings();
  
  return {
    name: settings.name,
    short_name: 'Legend',
    description: settings.seo.defaultDescription,
    start_url: '/',
    display: 'standalone',
    background_color: '#111111',
    theme_color: '#111111',
    icons: [
      {
        src: '/api/icon/192',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/api/icon/512',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/api/icon/512',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
