'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PersonIcon, EmailIcon, LockIcon } from '@/components/ui/icons'
import { AuthInput } from '@/components/ui/AuthInput'
import { theme } from '@/lib/theme'

export function RegisterForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const form = e.currentTarget
    const firstName = (form.elements.namedItem('firstName') as HTMLInputElement).value.trim()
    const lastName = (form.elements.namedItem('lastName') as HTMLInputElement).value.trim()
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim()
    const password = (form.elements.namedItem('password') as HTMLInputElement).value
    if (!agreedToTerms) {
      setError('Please agree to the terms and privacy policy.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json?.error ?? 'Registration failed.')
        return
      }
      if (json?.success && json?.data?.message) {
        router.push('/auth/login?registered=1')
        router.refresh()
        return
      }
      setError('Registration failed.')
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
      <div className="grid grid-cols-2 gap-4">
        <AuthInput
          id="firstName"
          name="firstName"
          type="text"
          label="First name"
          placeholder="John"
          required
          autoComplete="given-name"
          icon={<PersonIcon />}
        />
        <AuthInput
          id="lastName"
          name="lastName"
          type="text"
          label="Last name"
          placeholder="Doe"
          required
          autoComplete="family-name"
          icon={<PersonIcon />}
        />
      </div>
      <AuthInput
        id="email"
        name="email"
        type="email"
        label="Email address"
        placeholder="johndoe@domain.com"
        required
        autoComplete="email"
        icon={<EmailIcon />}
      />
      <AuthInput
        id="password"
        name="password"
        type={showPassword ? 'text' : 'password'}
        label="Password"
        placeholder="Password (+8 characters)"
        required
        minLength={8}
        autoComplete="new-password"
        icon={<LockIcon />}
        rightSlot={
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="text-neutral-500 hover:text-white"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            👁
          </button>
        }
      />
      <div className="flex items-start gap-3">
        <input
          id="terms"
          type="checkbox"
          checked={agreedToTerms}
          onChange={(e) => setAgreedToTerms(e.target.checked)}
          className={`mt-1 rounded bg-black text-[${theme.accentGoldFocus}] focus:ring-[${theme.accentGoldFocus}]`}
          style={{ borderColor: theme.inputBorder }}
        />
        <label htmlFor="terms" className="text-sm text-white cursor-default select-none">
          I agree to the{' '}
          <Link href="/terms" className="hover:underline" style={{ color: theme.accentGold }}>
            terms
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="hover:underline" style={{ color: theme.accentGold }}>
            privacy policy
          </Link>
          .
        </label>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-lg font-medium text-black transition-colors disabled:opacity-60 cursor-pointer select-none"
        style={{ backgroundColor: theme.accentGold }}
      >
        {loading ? 'Creating account…' : 'Create a new account'}
      </button>
    </form>
  )
}
