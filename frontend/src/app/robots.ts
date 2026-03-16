import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/login', '/signup', '/dashboard', '/settings'],
    },
    sitemap: 'https://prompt-forge-two-indol.vercel.app/sitemap.xml',
  }
}
