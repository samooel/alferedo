import { Heart } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="flex items-center justify-center gap-1.5 border-t border-white/15 bg-white/10 backdrop-blur-xl px-6 py-5 text-center text-sm text-white/65">
      <span>{year} - All rights reserved for uikar.com - Developed with</span>
      <Heart size={15} className="fill-red-500 text-red-500" aria-label="love" />
      <span>by uikar.com</span>
    </footer>
  )
}
