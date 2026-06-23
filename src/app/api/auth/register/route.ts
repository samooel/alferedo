import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const WP_URL = process.env.WP_URL

export async function POST(req: NextRequest) {
  if (!WP_URL) {
    return NextResponse.json({ error: 'WP_URL is not configured.' }, { status: 500 })
  }

  const { username, email, password, code } = await req.json()

  // Step 1 — create user via custom WordPress endpoint (code verified server-side by WP)
  const registerRes = await fetch(`${WP_URL}/wp-json/alfredo/v1/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password, code }),
  })

  const registerData = await registerRes.json()

  if (!registerRes.ok) {
    return NextResponse.json(
      { error: registerData.message ?? 'Registration failed.' },
      { status: registerRes.status }
    )
  }

  // Step 2 — auto-login the new user
  const tokenRes = await fetch(`${WP_URL}/wp-json/jwt-auth/v1/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })

  const tokenData = await tokenRes.json()

  if (!tokenRes.ok) {
    return NextResponse.json(
      { error: 'Account created but sign-in failed. Please log in manually.' },
      { status: 500 }
    )
  }

  const hash = crypto.createHash('md5').update(tokenData.user_email.trim().toLowerCase()).digest('hex')

  const meRes = await fetch(`${WP_URL}/wp-json/alfredo/v1/me`, {
    headers: { Authorization: `Bearer ${tokenData.token}` },
  })
  const meData = meRes.ok ? await meRes.json() : {}
  const isAdmin = meData.isAdmin === true

  return NextResponse.json({
    token:         tokenData.token,
    name:          tokenData.user_display_name,
    email:         tokenData.user_email,
    username:      tokenData.user_nicename,
    avatar:        `https://www.gravatar.com/avatar/${hash}?s=96&d=mp`,
    registeredDate: new Date().toISOString(),
    isAdmin,
  })
}
