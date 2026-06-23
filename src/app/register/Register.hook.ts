import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/src/context/AppContext'
import type { Step } from './Register.types'

export function useRegisterPage() {
  const { register } = useApp()
  const router = useRouter()

  const [step, setStep] = useState<Step>('form')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  const sendCode = async (): Promise<boolean> => {
    const res = await fetch('/api/auth/send-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error ?? 'Could not send verification email.')
      return false
    }
    return true
  }

  const startResendCooldown = () => {
    setResendCooldown(60)
    const interval = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) { clearInterval(interval); return 0 }
        return prev - 1
      })
    }, 1000)
  }

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value.replace(/\D/g, '').slice(0, 6))
  }

  const handleSendCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    const ok = await sendCode()
    setLoading(false)
    if (ok) {
      setStep('verify')
      startResendCooldown()
    }
  }

  const handleResend = async () => {
    setError('')
    setLoading(true)
    const ok = await sendCode()
    setLoading(false)
    if (ok) startResendCooldown()
  }

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await register(username, email, password, code)
    setLoading(false)
    if (result.error) {
      setError(result.error)
      return
    }
    router.push('/profile')
  }

  const goBackToForm = () => {
    setStep('form')
    setError('')
    setCode('')
  }

  return {
    step,
    username, setUsername,
    email, setEmail,
    password, setPassword,
    confirm, setConfirm,
    code, handleCodeChange,
    error,
    loading,
    resendCooldown,
    handleSendCode,
    handleResend,
    handleVerify,
    goBackToForm,
  }
}
