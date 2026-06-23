import { NextRequest, NextResponse } from 'next/server'

const WP_URL = process.env.WP_URL

export async function GET() {
  if (!WP_URL) return NextResponse.json({ error: 'WP_URL not configured' }, { status: 500 })

  const res = await fetch(`${WP_URL}/wp-json/alfredo/v1/sound-categories`, { cache: 'no-store' })
  const data = await res.json()

  if (!res.ok) return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 502 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  if (!WP_URL) return NextResponse.json({ error: 'WP_URL not configured' }, { status: 500 })

  const token = req.headers.get('Authorization')
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name } = await req.json()
  if (!name?.trim()) return NextResponse.json({ error: 'name is required' }, { status: 400 })

  const res = await fetch(`${WP_URL}/wp-json/alfredo/v1/sound-categories`, {
    method: 'POST',
    headers: { Authorization: token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  })

  const data = await res.json()
  if (!res.ok) return NextResponse.json({ error: data.message ?? 'Failed to create category' }, { status: res.status })
  return NextResponse.json(data)
}
