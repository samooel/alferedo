import type { Sound, Category } from '@/src/data/sounds'

export type { Sound, Category }

export interface UploadFormState {
  title: string
  iconName: string
  category: string
  newCategoryName: string
  file: File | null
}

export interface AdminState {
  sounds: Sound[]
  categories: Category[]
  form: UploadFormState
  loading: boolean
  uploading: boolean
  creatingCategory: boolean
  error: string | null
  success: string | null
}

export interface EditSoundFormState {
  title: string
  iconName: string
  category: string
}
