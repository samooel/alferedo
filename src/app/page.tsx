'use client'

import { Square } from 'lucide-react'
import SoundCard from '@/src/components/SoundCard'
import Loader from '@/src/components/Loader'
import { useHomePage } from './page.hook'

export default function HomePage() {
  const {
    categories,
    activeCategory,
    loading,
    orderedSounds,
    isHidden,
    setActiveCategory,
    stopAllSounds,
  } = useHomePage()

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
          <div className="mb-10 flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap justify-center gap-2">
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
              <button
                onClick={stopAllSounds}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/20"
                aria-label="Stop all sounds"
              >
                <Square size={14} className="fill-white text-white" />
                <span>Stop all</span>
              </button>
            </div>
          </div>
        )}

        {loading && <Loader message="Loading sounds…" />}

        {!loading && orderedSounds.length === 0 && (
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
