import { Coffee, Droplet, Feather, Waves, Wind, Flame, FlameKindling, Cloud, Moon, Leaf, Music, CloudLightning, CloudRain, TrainFront, type LucideIcon } from 'lucide-react'
import type { SoundIconName } from '@/src/data/sounds'

export const soundIconMap: Record<SoundIconName, LucideIcon> = {
  droplet: Droplet,
  feather: Feather,
  waves:   Waves,
  wind:    Wind,
  flame:   Flame,
  fire:    FlameKindling,
  cloud:   Cloud,
  moon:    Moon,
  leaf:    Leaf,
  music:   Music,
  thunder: CloudLightning,
  storm:   CloudRain,
  cafe:    Coffee,
  train:   TrainFront,
}

export const soundIconOptions: { value: SoundIconName; label: string }[] = [
  { value: 'droplet',  label: 'Droplet (Water)'    },
  { value: 'waves',    label: 'Waves (Ocean)'       },
  { value: 'feather',  label: 'Feather (Birds)'     },
  { value: 'wind',     label: 'Wind'                },
  { value: 'flame',    label: 'Flame (Fire)'        },
  { value: 'fire',     label: 'Fire'                },
  { value: 'cloud',    label: 'Cloud'               },
  { value: 'moon',     label: 'Moon (Night)'        },
  { value: 'leaf',     label: 'Leaf (Forest)'       },
  { value: 'music',    label: 'Music (Ambient)'     },
  { value: 'thunder',  label: 'Thunder (Lightning)' },
  { value: 'storm',    label: 'Storm (Rain)'        },
  { value: 'cafe',     label: 'Cafe'                },
  { value: 'train',    label: 'Train'               },
]
