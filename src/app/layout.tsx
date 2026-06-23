import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AppProvider } from '@/src/context/AppContext'
import NavBar from '@/src/components/NavBar'

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
      <body className={inter.variable}>
        <AppProvider>
          <NavBar />
          {children}
        </AppProvider>
      </body>
    </html>
  )
}
