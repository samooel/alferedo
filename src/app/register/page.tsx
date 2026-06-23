'use client'

import Link from 'next/link'
import { Mail } from 'lucide-react'
import { useRegisterPage } from './Register.hook'

export default function RegisterPage() {
  const {
    step,
    username, setUsername,
    email, setEmail,
    password, setPassword,
    confirm, setConfirm,
    code, handleCodeChange,
    error,
    loading,
    resendCooldown,
    handleSendCode,
    handleResend,
    handleVerify,
    goBackToForm,
  } = useRegisterPage()

  return (
    <main className="min-h-screen bg-gradient-to-br from-cyan-500 via-sky-500 to-teal-500 flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-white/15 backdrop-blur-xl rounded-[32px] p-10 border border-white/20 shadow-xl">

        {step === 'form' ? (
          <>
            <h1 className="text-4xl font-extralight text-white font-carattere text-center mb-2">
              Create account
            </h1>
            <p className="text-white/60 text-center text-sm mb-8">Join Alfredo and start relaxing</p>

            <form onSubmit={handleSendCode} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-white/70 text-sm">Username</label>
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
                <label className="text-white/70 text-sm">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
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
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:border-white/50 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-white/70 text-sm">Confirm Password</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  required
                  autoComplete="new-password"
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
                className="mt-2 bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed border border-white/30 text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Mail size={16} />
                {loading ? 'Sending code…' : 'Send verification code'}
              </button>
            </form>

            <p className="text-center text-white/50 text-sm mt-6">
              Already have an account?{' '}
              <Link href="/login" className="text-white hover:underline">Sign in</Link>
            </p>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-white/20 border border-white/30 flex items-center justify-center">
                <Mail size={28} className="text-white" />
              </div>
            </div>

            <h1 className="text-3xl font-extralight text-white font-carattere text-center mb-2">
              Check your email
            </h1>
            <p className="text-white/60 text-center text-sm mb-1">We sent a 6-digit code to</p>
            <p className="text-white font-medium text-center text-sm mb-8">{email}</p>

            <form onSubmit={handleVerify} className="flex flex-col gap-4">
              <input
                type="text"
                value={code}
                onChange={handleCodeChange}
                required
                inputMode="numeric"
                placeholder="000000"
                maxLength={6}
                className="bg-white/10 border border-white/20 rounded-xl px-4 py-4 text-white text-center text-2xl tracking-[0.5em] placeholder-white/20 outline-none focus:border-white/50 transition-colors font-mono"
              />

              {error && (
                <p className="text-red-200 text-sm bg-red-500/20 border border-red-400/30 rounded-xl px-4 py-3">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || code.length < 6}
                className="mt-2 bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed border border-white/30 text-white font-medium py-3 rounded-xl transition-all"
              >
                {loading ? 'Verifying…' : 'Create account'}
              </button>
            </form>

            <div className="text-center mt-6 flex flex-col gap-2">
              <button
                onClick={handleResend}
                disabled={loading || resendCooldown > 0}
                className="text-white/50 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed text-sm transition-colors"
              >
                {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend code'}
              </button>
              <button
                onClick={goBackToForm}
                className="text-white/40 hover:text-white/70 text-sm transition-colors"
              >
                ← Change email
              </button>
            </div>
          </>
        )}

      </div>
    </main>
  )
}
