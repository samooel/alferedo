import { usePathname, useRouter } from 'next/navigation'
import { useApp } from '@/src/context/AppContext'

export function useNavBar() {
  const { user, logout } = useApp()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const linkClass = (href: string) =>
    `text-sm transition-colors ${pathname === href ? 'text-white font-medium' : 'text-white/60 hover:text-white'}`

  return { user, handleLogout, linkClass }
}
