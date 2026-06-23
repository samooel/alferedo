import { NextResponse } from 'next/server'

const WP_URL = process.env.WP_URL

export async function GET() {
  if (!WP_URL) return NextResponse.json({ error: 'WP_URL not configured' }, { status: 500 })

  const res = await fetch(`${WP_URL}/wp-json/alfredo/v1/sounds`, { cache: 'no-store' })
  const data = await res.json()

  if (!res.ok) return NextResponse.json({ error: 'Failed to fetch sounds' }, { status: 502 })
  return NextResponse.json(data)
}
