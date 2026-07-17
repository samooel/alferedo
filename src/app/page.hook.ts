import { useState, useEffect, useMemo } from 'react'
import { useApp } from '@/src/context/AppContext'
import type { Sound, Category } from '@/src/data/sounds'
import type { UseHomePageReturn } from './page.types'

export function useHomePage(): UseHomePageReturn {
  const { favorites } = useApp()
  const [sounds, setSounds] = useState<Sound[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/sounds').then(r => r.json()),
      fetch('/api/categories').then(r => r.json()),
    ])
      .then(([s, c]) => {
        if (Array.isArray(s)) setSounds(s)
        if (Array.isArray(c)) setCategories(c)
      })
      .finally(() => setLoading(false))
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

  const stopAllSounds = () => {
    document.querySelectorAll('audio').forEach(audio => {
      audio.pause()
      audio.currentTime = 0
    })
  }

  return {
    sounds,
    categories,
    activeCategory,
    loading,
    orderedSounds,
    isHidden,
    setActiveCategory,
    stopAllSounds,
  }
}
