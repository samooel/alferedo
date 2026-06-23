import { useRef, useState } from 'react'
import { soundIconMap } from '@/src/lib/soundIcons'
import { useApp } from '@/src/context/AppContext'
import type { SoundCardProps } from './SoundCard.types'

export function useSoundCard({ sound }: SoundCardProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const { favorites, toggleFavorite, volume } = useApp()

  const isFavorite = favorites.includes(sound.id)
  const Icon = soundIconMap[sound.iconName]

  const toggle = async () => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
    } else {
      audio.volume = volume / 100
      await audio.play()
    }
  }

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleFavorite(sound.id)
  }

  const onPlay = () => setIsPlaying(true)
  const onPause = () => setIsPlaying(false)

  return { audioRef, isPlaying, isFavorite, Icon, toggle, handleFavorite, onPlay, onPause }
}
