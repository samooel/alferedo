'use client'

import Link from 'next/link'
import { useLoginPage } from './Login.hook'

export default function LoginPage() {
  const { username, setUsername, password, setPassword, error, loading, handleSubmit } = useLoginPage()

  return (
    <main className="min-h-screen bg-gradient-to-br from-cyan-500 via-sky-500 to-teal-500 flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-white/15 backdrop-blur-xl rounded-[32px] p-10 border border-white/20 shadow-xl">

        <h1 className="text-4xl font-extralight text-white font-carattere text-center mb-2">
          Welcome back
        </h1>
        <p className="text-white/60 text-center text-sm mb-8">Sign in with your WordPress account</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-white/70 text-sm">Username or Email</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              autoComplete="username"
              placeholder="your_username"
              className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:border-white/50 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-white/70 text-sm">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:border-white/50 transition-colors"
            />
          </div>

          {error && (
            <p className="text-red-200 text-sm bg-red-500/20 border border-red-400/30 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed border border-white/30 text-white font-medium py-3 rounded-xl transition-all"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-white/50 text-sm mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-white hover:underline">Sign up</Link>
        </p>

      </div>
    </main>
  )
}
