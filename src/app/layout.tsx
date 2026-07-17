import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AppProvider } from '@/src/context/AppContext'
import NavBar from '@/src/components/NavBar'
import Footer from '@/src/components/Footer'
import { Analytics } from '@vercel/analytics/next'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://uikar.com'),
  title: {
    default: 'Alfredo | Relax. Focus. Sleep.',
    template: '%s | Alfredo',
  },
  description: 'Relax. Focus. Sleep. Enjoy calming sounds for rest, concentration, and bedtime.',
  keywords: ['sleep sounds', 'relaxation sounds', 'focus sounds', 'meditation sounds', 'ambient sounds'],
  authors: [{ name: 'uikar' }],
  creator: 'uikar',
  publisher: 'uikar',
  applicationName: 'Alfredo',
  manifest: '/manifest.webmanifest',
  alternates: {
    canonical: 'https://uikar.com',
  },
  openGraph: {
    title: 'Alfredo',
    description: 'Relax. Focus. Sleep. Enjoy calming sounds for rest, concentration, and bedtime.',
    url: 'https://uikar.com',
    siteName: 'Alfredo',
    type: 'website',
    images: [{ url: '/android-chrome-512x512.png', width: 512, height: 512, alt: 'Alfredo app icon' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alfredo',
    description: 'Relax. Focus. Sleep. Enjoy calming sounds for rest, concentration, and bedtime.',
    images: ['/android-chrome-512x512.png'],
  },
  icons: {
    icon: [
      { url: '/icon.png', sizes: '48x48', type: 'image/png' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/icon.png',
    apple: '/apple-icon.png',
  },
  appleWebApp: {
    capable: true,
    title: 'Alfredo',
    statusBarStyle: 'black-translucent',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#0f766e',
  colorScheme: 'dark',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} bg-gradient-to-br from-cyan-500 via-sky-500 to-teal-500`}>
        <AppProvider>
          <NavBar />
          {children}
          <Footer />
        </AppProvider>
        <Analytics />
      </body>
    </html>
  )
}
