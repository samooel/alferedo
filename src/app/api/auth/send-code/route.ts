import { NextRequest, NextResponse } from 'next/server'

const WP_URL = process.env.WP_URL

export async function POST(req: NextRequest) {
  if (!WP_URL) {
    return NextResponse.json({ error: 'WP_URL is not configured.' }, { status: 500 })
  }

  const { email } = await req.json()

  const res = await fetch(`${WP_URL}/wp-json/alfredo/v1/send-verification`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })

  const data = await res.json()

  if (!res.ok) {
    return NextResponse.json(
      { error: data.message ?? 'Could not send verification email.' },
      { status: res.status }
    )
  }

  return NextResponse.json({ success: true })
}
