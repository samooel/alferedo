'use client'

import { useState, useEffect, useMemo } from 'react'
import SoundCard from '@/src/components/SoundCard'
import Loader from '@/src/components/Loader'
import { useApp } from '@/src/context/AppContext'
import type { Sound, Category } from '@/src/data/sounds'

export default function HomePage() {
  const { favorites } = useApp()
  const [sounds, setSounds]         = useState<Sound[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/sounds').then(r => r.json()),
      fetch('/api/categories').then(r => r.json()),
    ]).then(([s, c]) => {
      if (Array.isArray(s)) setSounds(s)
      if (Array.isArray(c)) setCategories(c)
    }).finally(() => setLoading(false))
  }, [])

  const isHidden = (sound: Sound) =>
    activeCategory !== 'all' && sound.category !== activeCategory

  const orderedSounds = useMemo(() => {
    const favoriteIds = new Set(favorites)

    return [...sounds].sort((a, b) => {
      const aFavorite = favoriteIds.has(a.id)
      const bFavorite = favoriteIds.has(b.id)

      if (aFavorite === bFavorite) return 0
      return aFavorite ? -1 : 1
    })
  }, [favorites, sounds])

  return (
    <main className="min-h-screen bg-gradient-to-br from-cyan-500 via-sky-500 to-teal-500 text-white p-8 pt-24">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-12 pt-10">
          <h1 className="text-7xl font-extralight mb-5 tracking-tight font-carattere">
            Alfredo
          </h1>
          <p className="text-white/80 text-xl">
            Relax. Focus. Sleep.
          </p>
        </div>

        {/* Category filter tabs */}
        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-colors ${
                activeCategory === 'all'
                  ? 'bg-white/30 border-white/50'
                  : 'bg-white/10 border-white/20 hover:bg-white/20'
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.slug)}
                className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-colors ${
                  activeCategory === cat.slug
                    ? 'bg-white/30 border-white/50'
                    : 'bg-white/10 border-white/20 hover:bg-white/20'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {loading && <Loader message="Loading sounds…" />}

        {!loading && sounds.length === 0 && (
          <div className="text-center text-white/60 py-20">No sounds found.</div>
        )}

        {/* All cards stay mounted so audio keeps playing when the filter changes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {orderedSounds.map(sound => (
            <div key={sound.id} className={isHidden(sound) ? 'hidden' : ''}>
              <SoundCard sound={sound} />
            </div>
          ))}
        </div>

      </div>
    </main>
  )
}
