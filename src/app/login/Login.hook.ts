import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/src/context/AppContext'

export function useLoginPage() {
  const { login } = useApp()
  const router = useRouter()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(username, password)

    setLoading(false)

    if (result.error) {
      setError(result.error)
      return
    }

    router.push('/profile')
  }

  return { username, setUsername, password, setPassword, error, loading, handleSubmit }
}
