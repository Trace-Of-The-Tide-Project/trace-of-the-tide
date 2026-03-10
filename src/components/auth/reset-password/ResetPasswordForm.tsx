'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { LockIcon } from '@/components/ui/icons'
import { AuthInput } from '@/components/ui/AuthInput'
import { theme } from '@/lib/theme'

export function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const form = e.currentTarget
    const password = (form.elements.namedItem('password') as HTMLInputElement).value
    const confirmPassword = (form.elements.namedItem('confirmPassword') as HTMLInputElement).value

    if (!token) {
      setError('Invalid or missing reset link. Please request a new one.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    setTimeout(() => {
      router.push('/auth/success')
      router.refresh()
      setLoading(false)
    }, 800)
  }

  // Allow opening reset password page without token (e.g. for testing/preview)
  // if (!token) {
  //   return (
  //     <div className="w-full max-w-md space-y-4">
  //       <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/30 rounded-lg px-3 py-2">
  //         Invalid or missing reset link. Please request a new password reset from the login page.
  //       </p>
  //       <Link
  //         href="/auth/forgot-password"
  //         className="inline-block text-sm hover:underline"
  //         style={{ color: theme.accentGold }}
  //       >
  //         Request new reset link
  //       </Link>
  //     </div>
  //   )
  // }

  return (
    <form onSubmit={handleSubmit} className="relative space-y-6 w-full max-w-md">
      {error && (
        <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/30 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
      <AuthInput
        id="password"
        name="password"
        type={showPassword ? 'text' : 'password'}
        label="New password"
        placeholder="Enter a new password"
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
      <AuthInput
        id="confirmPassword"
        name="confirmPassword"
        type={showConfirm ? 'text' : 'password'}
        label="Confirm new password"
        placeholder="Confirm your new password"
        required
        minLength={8}
        autoComplete="new-password"
        icon={<LockIcon />}
        rightSlot={
          <button
            type="button"
            onClick={() => setShowConfirm((p) => !p)}
            className="text-neutral-500 hover:text-white"
            aria-label={showConfirm ? 'Hide password' : 'Show password'}
          >
            👁
          </button>
        }
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-lg font-medium text-black transition-colors disabled:opacity-60 cursor-pointer select-none"
        style={{ backgroundColor: theme.accentGold }}
      >
        {loading ? 'Resetting…' : 'Reset password'}
      </button>
    </form>
  )
}
