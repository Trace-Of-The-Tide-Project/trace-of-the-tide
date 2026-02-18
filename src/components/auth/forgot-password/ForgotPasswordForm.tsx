'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { EmailIcon } from '@/components/ui/icons'
import { AuthInput } from '@/components/ui/AuthInput'
import { theme } from '@/lib/theme'
import { authEndpoints } from '@/lib/api'

export function ForgotPasswordForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const form = e.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim()

    if (!email) {
      setError('Please enter your email address.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(json?.message ?? json?.error ?? 'Something went wrong. Please try again.')
        return
      }
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('forgot-password-email', email)
      }
      router.push('/auth/forgot-password/email-sent')
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative space-y-6 w-full max-w-md">
      {error && (
        <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/30 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
      <AuthInput
        id="email"
        name="email"
        type="email"
        label="Email address"
        placeholder="Enter your email address"
        required
        autoComplete="email"
        icon={<EmailIcon />}
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-lg font-medium text-black transition-colors disabled:opacity-60 cursor-pointer select-none"
        style={{ backgroundColor: theme.accentGold }}
      >
        {loading ? 'Sending…' : 'Send reset email'}
      </button>
    </form>
  )
}
