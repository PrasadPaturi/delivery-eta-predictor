/**
 * Root Layout Component
 * 
 * This is the main layout wrapper for the entire application.
 * It sets up:
 * - Metadata for SEO
 * - Global styling and fonts
 * - Theme provider for dark mode support
 * - Sonner toast notifications
 */

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Delivery ETA Predictor - AI-Powered Supply Chain Intelligence',
    template: '%s | Delivery ETA Predictor',
  },
  description: 'Predict delivery delays before they occur using AI-powered analysis of historical PO fulfillment data, supplier performance patterns, and logistics timelines.',
  keywords: ['supply chain', 'delivery prediction', 'ETA', 'procurement', 'logistics', 'AI'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://delivery-eta-predictor.com',
    siteName: 'Delivery ETA Predictor',
    title: 'Delivery ETA Predictor - AI-Powered Supply Chain Intelligence',
    description: 'Predict delivery delays before they occur using AI analysis',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Delivery ETA Predictor',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Delivery ETA Predictor',
    description: 'Predict delivery delays before they occur',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
