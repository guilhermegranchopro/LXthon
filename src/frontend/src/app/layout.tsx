import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

// Optimized font loading with display swap
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial']
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#3B82F6'
}

export const metadata: Metadata = {
  title: 'Eye Vessel Segmentation | LXthon 2025 - Team Prometheus',
  description: 'AI-powered blood vessel segmentation in slit-lamp eye images using U-Net deep learning. Built by Team Prometheus for LXthon 2025.',
  keywords: ['eye', 'vessel', 'segmentation', 'AI', 'machine learning', 'ophthalmology', 'LXthon', 'hackathon', 'prometheus'],
  authors: [{ name: 'Team Prometheus - Guilherme Grancho & Vasco Pereira' }],
  metadataBase: new URL('https://eye-vessel-segmentation.vercel.app'),
  openGraph: {
    title: 'AI Eye Vessel Segmentation - Team Prometheus',
    description: 'Advanced AI-powered eye vessel analysis using deep learning',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Eye Vessel Segmentation Preview'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Eye Vessel Segmentation - LXthon 2025',
    description: 'Advanced AI-powered eye vessel analysis using deep learning',
    images: ['/og-image.png']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icons/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Performance optimizations */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        
        {/* Critical resource hints */}
        <link rel="preload" href="/logos/LXthon_logo.png" as="image" type="image/png" />
        <link rel="preload" href="/logos/prometheus_logo.png" as="image" type="image/png" />
        
        {/* PWA theme */}
        <meta name="theme-color" content="#3B82F6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AI Vision" />
        
        {/* Performance hints */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          {children}
        </div>
      </body>
    </html>
  )
}
