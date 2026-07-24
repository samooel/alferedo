'use client'

import Link from 'next/link'
import { useNavBar } from './NavBar.hook'

export default function NavBar() {
  const { user, handleLogout, linkClass } = useNavBar()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-xl border-b border-white/20 px-8 h-16 flex items-center justify-between">
      <Link href="/" className="text-2xl font-extralight tracking-tight font-carattere text-white">
        Alfredo
      </Link>

      <div className="flex items-center gap-6">
        <Link href="/" className={linkClass('/')}>Home</Link>

        {user && (
          <Link href="/profile" className={linkClass('/profile')}>Profile</Link>
        )}

        {user?.isAdmin && (
          <Link href="/admin" className={linkClass('/admin')}>Admin</Link>
        )}

        <a
          href="https://www.paypal.com/donate/?business=7G5LNVHCQ9E54&amount=2&no_recurring=0&item_name=Buy+me+a+coffee&currency_code=USD"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm bg-sky-600/90 hover:bg-sky-500 border border-sky-400/60 text-white px-4 py-1.5 rounded-full transition-all"
        >
          Donate
        </a>

        {user ? (
          <button
            onClick={handleLogout}
            className="text-sm bg-white/15 hover:bg-white/25 border border-white/20 text-white px-4 py-1.5 rounded-full transition-all"
          >
            Logout
          </button>
        ) : (
          <Link
            href="/login"
            className="text-sm bg-white/15 hover:bg-white/25 border border-white/20 text-white px-4 py-1.5 rounded-full transition-all"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  )
}
