import { NextRequest, NextResponse } from 'next/server'

const WP_URL = process.env.WP_URL

export async function POST(req: NextRequest) {
  if (!WP_URL) return NextResponse.json({ error: 'WP_URL not configured' }, { status: 500 })

  const token = req.headers.get('Authorization')
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const form = await req.formData()
  const file     = form.get('file')     as File   | null
  const title    = form.get('title')    as string | null
  const iconName = form.get('iconName') as string | null
  const category = form.get('category') as string | null

  if (!file || !title?.trim()) {
    return NextResponse.json({ error: 'file and title are required' }, { status: 400 })
  }

  // Step 1: upload audio file to WordPress media library
  const mediaForm = new FormData()
  mediaForm.append('file', file, file.name)

  const mediaRes = await fetch(`${WP_URL}/wp-json/wp/v2/media`, {
    method: 'POST',
    headers: { Authorization: token },
    body: mediaForm,
  })

  const mediaData = await mediaRes.json()
  if (!mediaRes.ok) {
    return NextResponse.json(
      { error: mediaData.message ?? 'Media upload failed' },
      { status: mediaRes.status }
    )
  }

  // Step 2: create the sound post with the uploaded file URL
  const soundRes = await fetch(`${WP_URL}/wp-json/alfredo/v1/sounds`, {
    method: 'POST',
    headers: { Authorization: token, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title,
      file: mediaData.source_url,
      iconName: iconName ?? 'waves',
      category: category ?? '',
    }),
  })

  const soundData = await soundRes.json()
  if (!soundRes.ok) {
    return NextResponse.json(
      { error: soundData.message ?? 'Sound creation failed' },
      { status: soundRes.status }
    )
  }

  return NextResponse.json(soundData, { status: 201 })
}
