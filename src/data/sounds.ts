export type SoundIconName =
  | 'droplet'
  | 'feather'
  | 'waves'
  | 'wind'
  | 'flame'
  | 'fire'
  | 'cloud'
  | 'moon'
  | 'leaf'
  | 'music'
  | 'thunder'
  | 'storm'
  | 'cafe'
  | 'train'

export type Sound = {
  id: number
  title: string
  file: string
  iconName: SoundIconName
  category: string
  categoryLabel: string
}

export type Category = {
  id: number
  name: string
  slug: string
}
