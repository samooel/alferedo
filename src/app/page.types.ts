import type { Dispatch, SetStateAction } from 'react'
import type { Sound, Category } from '@/src/data/sounds'

export interface UseHomePageReturn {
  sounds: Sound[]
  categories: Category[]
  activeCategory: string
  loading: boolean
  orderedSounds: Sound[]
  isHidden: (sound: Sound) => boolean
  setActiveCategory: Dispatch<SetStateAction<string>>
  stopAllSounds: () => void
}
