'use client'

import { createContext, useContext, useState, useEffect } from 'react'

export type User = {
  name: string
  email: string
  username: string
  token: string
  avatar: string | null
  registeredDate: string | null
  isAdmin: boolean
}

type AppContextType = {
  user: User | null
  login: (username: string, password: string) => Promise<{ error?: string }>
  register: (username: string, email: string, password: string, code: string) => Promise<{ error?: string }>
  logout: () => void
  favorites: number[]
  toggleFavorite: (id: number) => void
  volume: number
  setVolume: (v: number) => void
  soundVolumes: Record<number, number>
  getSoundVolume: (id: number) => number
  setSoundVolume: (id: number, v: number) => void
  notifications: boolean
  setNotifications: (v: boolean) => void
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [favorites, setFavorites] = useState<number[]>([])
  const [volume, setVolumeState] = useState(80)
  const [soundVolumes, setSoundVolumes] = useState<Record<number, number>>({})
  const [notifications, setNotificationsState] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('alfredo')
    if (!stored) return
    const data = JSON.parse(stored)
    if (data.user)                  setUser({ isAdmin: false, ...data.user })
    if (data.favorites)             setFavorites(data.favorites)
    if (data.volume != null)        setVolumeState(data.volume)
    if (data.soundVolumes)          setSoundVolumes(data.soundVolumes)
    if (data.notifications != null) setNotificationsState(data.notifications)
  }, [])

  const persist = (patch: Partial<{ user: User | null; favorites: number[]; volume: number; soundVolumes: Record<number, number>; notifications: boolean }>) => {
    const current = JSON.parse(localStorage.getItem('alfredo') ?? '{}')
    localStorage.setItem('alfredo', JSON.stringify({ ...current, ...patch }))
  }

  const login = async (username: string, password: string): Promise<{ error?: string }> => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    const data = await res.json()
    if (!res.ok) return { error: data.error ?? 'Login failed.' }
    setUser(data)
    persist({ user: data })
    return {}
  }

  const register = async (username: string, email: string, password: string, code: string): Promise<{ error?: string }> => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, code }),
    })
    const data = await res.json()
    if (!res.ok) return { error: data.error ?? 'Registration failed.' }
    setUser(data)
    persist({ user: data })
    return {}
  }

  const logout = () => {
    setUser(null)
    persist({ user: null })
  }

  const toggleFavorite = (id: number) => {
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
      persist({ favorites: next })
      return next
    })
  }

  const setVolume = (v: number) => {
    setVolumeState(v)
    persist({ volume: v })
  }

  const getSoundVolume = (id: number) => soundVolumes[id] ?? volume

  const setSoundVolume = (id: number, v: number) => {
    const nextVolume = Math.min(100, Math.max(0, v))

    setSoundVolumes(prev => {
      const next = { ...prev, [id]: nextVolume }
      persist({ soundVolumes: next })
      return next
    })
  }

  const setNotifications = (v: boolean) => {
    setNotificationsState(v)
    persist({ notifications: v })
  }

  return (
    <AppContext.Provider value={{ user, login, register, logout, favorites, toggleFavorite, volume, setVolume, soundVolumes, getSoundVolume, setSoundVolume, notifications, setNotifications }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
