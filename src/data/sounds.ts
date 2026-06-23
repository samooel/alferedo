export type SoundIconName =
  | 'droplet'
  | 'feather'
  | 'waves'
  | 'wind'
  | 'flame'
  | 'cloud'
  | 'moon'
  | 'leaf'
  | 'music'
  | 'thunder'
  | 'storm'

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
