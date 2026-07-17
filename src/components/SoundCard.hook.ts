import { useEffect, useRef, useState } from 'react'
import { soundIconMap } from '@/src/lib/soundIcons'
import { useApp } from '@/src/context/AppContext'
import type { SoundCardProps } from './SoundCard.types'

export function useSoundCard({ sound }: SoundCardProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const { favorites, toggleFavorite, getSoundVolume, setSoundVolume } = useApp()

  const isFavorite = favorites.includes(sound.id)
  const soundVolume = getSoundVolume(sound.id)
  const Icon = soundIconMap[sound.iconName]

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = soundVolume / 100
  }, [soundVolume])

  const toggle = async () => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
    } else {
      audio.volume = soundVolume / 100
      await audio.play()
    }
  }

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleFavorite(sound.id)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    setSoundVolume(sound.id, Number(e.target.value))
  }

  const stopCardToggle = (e: React.SyntheticEvent) => {
    e.stopPropagation()
  }

  const onPlay = () => setIsPlaying(true)
  const onPause = () => setIsPlaying(false)

  return { audioRef, isPlaying, isFavorite, soundVolume, Icon, toggle, handleFavorite, handleVolumeChange, stopCardToggle, onPlay, onPause }
}
