import { NextRequest, NextResponse } from 'next/server'

const WP_URL = process.env.WP_URL

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!WP_URL) return NextResponse.json({ error: 'WP_URL not configured' }, { status: 500 })

  const token = req.headers.get('Authorization')
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  const res = await fetch(`${WP_URL}/wp-json/alfredo/v1/sounds/${id}`, {
    method: 'DELETE',
    headers: { Authorization: token },
  })

  const data = await res.json()
  if (!res.ok) return NextResponse.json({ error: data.message ?? 'Delete failed' }, { status: res.status })
  return NextResponse.json(data)
}
