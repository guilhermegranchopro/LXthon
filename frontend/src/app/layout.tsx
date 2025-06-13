import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Eye Vessel Segmentation | LXthon 2025 - Team Prometheus',
  description: 'AI-powered blood vessel segmentation in slit-lamp eye images using U-Net deep learning. Built by Team Prometheus for LXthon 2025.',
  keywords: ['eye', 'vessel', 'segmentation', 'AI', 'machine learning', 'ophthalmology', 'LXthon', 'hackathon', 'prometheus'],
  authors: [{ name: 'Team Prometheus - Guilherme Grancho & Vasco Pereira' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          {children}
        </div>
      </body>
    </html>
  )
}
