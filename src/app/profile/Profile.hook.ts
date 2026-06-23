import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/src/context/AppContext'
import type { Sound } from '@/src/data/sounds'

export function useProfilePage() {
  const { user, logout, favorites, toggleFavorite, volume, setVolume, notifications, setNotifications } = useApp()
  const router = useRouter()
  const [allSounds, setAllSounds]       = useState<Sound[]>([])
  const [loadingSounds, setLoadingSounds] = useState(false)

  useEffect(() => {
    if (!user) { router.push('/login'); return }
    setLoadingSounds(true)
    fetch('/api/sounds')
      .then(r => r.ok ? r.json() : [])
      .then((data: Sound[]) => setAllSounds(Array.isArray(data) ? data : []))
      .finally(() => setLoadingSounds(false))
  }, [user, router])

  const favoriteSounds = allSounds.filter(s => favorites.includes(s.id))

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return {
    user,
    favorites,
    toggleFavorite,
    volume,
    setVolume,
    notifications,
    setNotifications,
    favoriteSounds,
    loadingSounds,
    handleLogout,
  }
}
