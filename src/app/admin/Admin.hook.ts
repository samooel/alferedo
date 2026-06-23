'use client'

import { useState, useEffect, useCallback } from 'react'
import { useApp } from '@/src/context/AppContext'
import type { Sound, Category, UploadFormState } from './Admin.types'

const EMPTY_FORM: UploadFormState = {
  title: '',
  iconName: 'waves',
  category: '',
  newCategoryName: '',
  file: null,
}

export function useAdmin() {
  const { user } = useApp()

  const [sounds, setSounds]               = useState<Sound[]>([])
  const [categories, setCategories]       = useState<Category[]>([])
  const [form, setForm]                   = useState<UploadFormState>(EMPTY_FORM)
  const [loading, setLoading]             = useState(true)
  const [uploading, setUploading]         = useState(false)
  const [creatingCategory, setCreatingCategory] = useState(false)
  const [error, setError]                 = useState<string | null>(null)
  const [success, setSuccess]             = useState<string | null>(null)

  const authHeader = user ? `Bearer ${user.token}` : ''

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [soundsRes, catsRes] = await Promise.all([
        fetch('/api/sounds'),
        fetch('/api/categories'),
      ])
      if (soundsRes.ok) setSounds(await soundsRes.json())
      if (catsRes.ok)   setCategories(await catsRes.json())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const setField = (field: keyof UploadFormState, value: string | File | null) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const createCategory = async () => {
    if (!form.newCategoryName.trim()) return
    setCreatingCategory(true)
    setError(null)
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { Authorization: authHeader, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.newCategoryName.trim() }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Failed to create category'); return }
      setCategories(prev => [...prev, data])
      setField('newCategoryName', '')
      setField('category', data.slug)
    } catch {
      setError('Network error')
    } finally {
      setCreatingCategory(false)
    }
  }

  const uploadSound = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.file || !form.title.trim()) { setError('Title and audio file are required.'); return }
    setUploading(true)
    setError(null)
    setSuccess(null)
    try {
      const fd = new FormData()
      fd.append('file',     form.file)
      fd.append('title',    form.title.trim())
      fd.append('iconName', form.iconName)
      fd.append('category', form.category)

      const res = await fetch('/api/sounds/upload', {
        method: 'POST',
        headers: { Authorization: authHeader },
        body: fd,
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Upload failed'); return }
      setSuccess(`"${form.title}" uploaded successfully!`)
      setForm(EMPTY_FORM)
      await fetchAll()
    } catch {
      setError('Network error')
    } finally {
      setUploading(false)
    }
  }

  const deleteSound = async (id: number) => {
    setError(null)
    const res = await fetch(`/api/sounds/${id}`, {
      method: 'DELETE',
      headers: { Authorization: authHeader },
    })
    if (res.ok) {
      setSounds(prev => prev.filter(s => s.id !== id))
    } else {
      const data = await res.json()
      setError(data.error ?? 'Failed to delete sound')
    }
  }

  const deleteCategory = async (slug: string) => {
    setError(null)
    const res = await fetch(`/api/categories/${slug}`, {
      method: 'DELETE',
      headers: { Authorization: authHeader },
    })
    if (res.ok) {
      setCategories(prev => prev.filter(c => c.slug !== slug))
    } else {
      const data = await res.json()
      setError(data.error ?? 'Failed to delete category')
    }
  }

  return {
    user,
    sounds,
    categories,
    form,
    loading,
    uploading,
    creatingCategory,
    error,
    success,
    setField,
    createCategory,
    uploadSound,
    deleteSound,
    deleteCategory,
  }
}
