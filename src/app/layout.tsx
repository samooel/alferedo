import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AppProvider } from '@/src/context/AppContext'
import NavBar from '@/src/components/NavBar'
import Footer from '@/src/components/Footer'
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Alfredo',
  description: 'Relax. Focus. Sleep.',
  icons: { icon: '/favicon-48.png' },
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
