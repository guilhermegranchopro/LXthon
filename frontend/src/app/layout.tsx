import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Eye Vessel Segmentation | Hackathon Solution',
  description: 'AI-powered blood vessel segmentation in slit-lamp eye images using U-Net deep learning',
  keywords: ['eye', 'vessel', 'segmentation', 'AI', 'machine learning', 'ophthalmology'],
  authors: [{ name: 'Hackathon Team' }],
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          {children}
        </div>
      </body>
    </html>
  )
}
