import { Heart } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 border-t border-white/15 bg-white/10 px-6 py-5 text-center text-sm leading-relaxed text-white/65 backdrop-blur-xl">
      <span>{year} - All rights reserved for uikar.com - Developed with</span>
      <span className="inline-flex items-center gap-1">
        <Heart size={15} className="fill-red-500 text-red-500" aria-label="love" />
        <span>by uikar.com</span>
      </span>
    </footer>
  )
}
