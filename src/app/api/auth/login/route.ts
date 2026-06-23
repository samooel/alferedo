import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const WP_URL = process.env.WP_URL

function gravatarUrl(email: string): string {
  const hash = crypto.createHash('md5').update(email.trim().toLowerCase()).digest('hex')
  return `https://www.gravatar.com/avatar/${hash}?s=96&d=mp`
}

export async function POST(req: NextRequest) {
  if (!WP_URL) {
    return NextResponse.json({ error: 'WP_URL is not configured on the server.' }, { status: 500 })
  }

  const { username, password } = await req.json()

  const tokenRes = await fetch(`${WP_URL}/wp-json/jwt-auth/v1/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })

  const tokenData = await tokenRes.json()

  if (!tokenRes.ok) {
    return NextResponse.json(
      { error: tokenData.message ?? 'Invalid username or password.' },
      { status: 401 }
    )
  }

  const meRes = await fetch(`${WP_URL}/wp-json/alfredo/v1/me`, {
    headers: { Authorization: `Bearer ${tokenData.token}` },
  })
  const meData = meRes.ok ? await meRes.json() : {}
  const isAdmin = meData.isAdmin === true

  return NextResponse.json({
    token:    tokenData.token,
    name:     tokenData.user_display_name,
    email:    tokenData.user_email,
    username: tokenData.user_nicename,
    avatar:   gravatarUrl(tokenData.user_email),
    registeredDate: null,
    isAdmin,
  })
}
