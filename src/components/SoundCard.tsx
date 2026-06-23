'use client'

import { Heart } from 'lucide-react'
import type { SoundCardProps } from './SoundCard.types'
import { useSoundCard } from './SoundCard.hook'

export default function SoundCard({ sound }: SoundCardProps) {
  const { audioRef, isPlaying, isFavorite, Icon, toggle, handleFavorite, onPlay, onPause } = useSoundCard({ sound })

  return (
    <div
      onClick={toggle}
      className={`relative backdrop-blur-xl rounded-[32px] p-8 cursor-pointer border shadow-xl transition-all duration-300 flex flex-col items-center text-center ${
        isPlaying
          ? 'bg-white/35 border-white/50 scale-[0.97] shadow-inner'
          : 'bg-white/15 border-white/20 hover:scale-105'
      }`}
    >
      <button
        onClick={handleFavorite}
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Heart size={18} className={isFavorite ? 'fill-white text-white' : 'text-white/30'} />
      </button>

      <div className="mb-6 text-white flex justify-center">
        <Icon size={60} />
      </div>

      <h2 className="text-2xl font-semibold mb-2">{sound.title}</h2>

      <p className="text-white/70">{isPlaying ? 'Playing...' : 'Tap to play'}</p>

      <audio ref={audioRef} src={sound.file} loop onPlay={onPlay} onPause={onPause} />
    </div>
  )
}
