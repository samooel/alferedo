'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, FolderPlus, Music, Trash2 } from 'lucide-react'
import { useAdmin } from './Admin.hook'
import { soundIconOptions } from '@/src/lib/soundIcons'
import Loader from '@/src/components/Loader'

export default function AdminPage() {
  const router = useRouter()
  const {
    user, sounds, categories, form, loading,
    uploading, creatingCategory, error, success,
    setField, createCategory, uploadSound, deleteSound, deleteCategory,
  } = useAdmin()

  useEffect(() => {
    if (!user) { router.replace('/login'); return }
    if (!user.isAdmin) router.replace('/')
  }, [user, router])

  if (!user || !user.isAdmin) return <Loader fullPage />

  return (
    <main className="min-h-screen bg-gradient-to-br from-cyan-500 via-sky-500 to-teal-500 text-white p-8 pt-24">
      <div className="max-w-4xl mx-auto space-y-10">

        <h1 className="text-4xl font-extralight tracking-tight font-carattere">Sound Admin</h1>

        {/* ── Categories ── */}
        <section className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-[24px] p-6 space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FolderPlus size={20} /> Categories
          </h2>

          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <span key={cat.id} className="flex items-center gap-1.5 bg-white/20 border border-white/30 rounded-full pl-3 pr-2 py-1 text-sm">
                {cat.name}
                <button
                  onClick={() => deleteCategory(cat.slug)}
                  className="hover:text-red-300 transition-colors ml-0.5"
                  aria-label={`Delete ${cat.name}`}
                >
                  <Trash2 size={13} />
                </button>
              </span>
            ))}
            {!loading && categories.length === 0 && (
              <span className="text-white/60 text-sm">No categories yet.</span>
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="New category name…"
              value={form.newCategoryName}
              onChange={e => setField('newCategoryName', e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), createCategory())}
              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm placeholder-white/40 outline-none focus:border-white/50"
            />
            <button
              onClick={createCategory}
              disabled={creatingCategory || !form.newCategoryName.trim()}
              className="bg-white/20 hover:bg-white/30 disabled:opacity-40 border border-white/30 rounded-xl px-4 py-2 text-sm font-medium transition-colors"
            >
              {creatingCategory ? 'Adding…' : 'Add'}
            </button>
          </div>
        </section>

        {/* ── Upload Sound ── */}
        <section className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-[24px] p-6 space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Upload size={20} /> Upload Sound
          </h2>

          {error   && <p className="bg-red-500/20 border border-red-400/40 rounded-xl px-4 py-2 text-sm">{error}</p>}
          {success && <p className="bg-green-500/20 border border-green-400/40 rounded-xl px-4 py-2 text-sm">{success}</p>}

          <form onSubmit={uploadSound} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="space-y-1">
                <span className="text-sm text-white/70">Title *</span>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rain Forest"
                  value={form.title}
                  onChange={e => setField('title', e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm placeholder-white/40 outline-none focus:border-white/50"
                />
              </label>

              <label className="space-y-1">
                <span className="text-sm text-white/70">Category</span>
                <select
                  value={form.category}
                  onChange={e => setField('category', e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm outline-none focus:border-white/50 appearance-none"
                >
                  <option value="">— No category —</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              </label>

              <label className="space-y-1">
                <span className="text-sm text-white/70">Icon</span>
                <select
                  value={form.iconName}
                  onChange={e => setField('iconName', e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm outline-none focus:border-white/50 appearance-none"
                >
                  {soundIconOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </label>

              <label className="space-y-1">
                <span className="text-sm text-white/70">Audio File * (mp3, ogg, wav)</span>
                <input
                  type="file"
                  accept="audio/*"
                  required
                  onChange={e => setField('file', e.target.files?.[0] ?? null)}
                  className="w-full text-sm text-white/80 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-white/20 file:text-white file:text-sm hover:file:bg-white/30 cursor-pointer"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="bg-white/25 hover:bg-white/35 disabled:opacity-40 border border-white/30 rounded-xl px-6 py-2.5 font-medium transition-colors flex items-center gap-2"
            >
              <Upload size={16} />
              {uploading ? 'Uploading…' : 'Upload Sound'}
            </button>
          </form>
        </section>

        {/* ── Existing Sounds ── */}
        <section className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-[24px] p-6 space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Music size={20} /> Sounds ({sounds.length})
          </h2>

          {loading && <Loader />}

          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {sounds.map(sound => (
              <div key={sound.id} className="flex items-center justify-between bg-white/10 border border-white/15 rounded-xl px-4 py-3 gap-4">
                <div className="min-w-0">
                  <p className="font-medium truncate">{sound.title}</p>
                  <p className="text-xs text-white/60">{sound.categoryLabel || 'No category'} · {sound.iconName}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <audio controls src={sound.file} className="h-8 w-40 opacity-80" />
                  <button
                    onClick={() => deleteSound(sound.id)}
                    className="p-1.5 hover:text-red-300 transition-colors"
                    aria-label={`Delete ${sound.title}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            {!loading && sounds.length === 0 && (
              <p className="text-white/60 text-sm">No sounds uploaded yet.</p>
            )}
          </div>
        </section>

      </div>
    </main>
  )
}
