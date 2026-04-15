'use client'

import { useState } from 'react'
import Link from 'next/link'
import { EmailIcon, LockIcon } from '@/components/ui/icons'
import { AuthInput } from '@/components/ui/AuthInput'
import { theme } from '@/lib/theme'
import { useLoginForm } from './useLoginForm'

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const { loading, error, registered, email, setEmail, rememberMe, setRememberMe, handleSubmit } =
    useLoginForm()

  return (
    <form onSubmit={handleSubmit} className="relative space-y-6 w-full max-w-md">
      {registered === '1' && (
        <p className="text-sm text-green-400 bg-green-400/10 border border-green-400/30 rounded-lg px-3 py-2">
          Account created. You can log in now.
        </p>
      )}
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
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <AuthInput
        id="password"
        name="password"
        type={showPassword ? 'text' : 'password'}
        label="Password"
        placeholder="Enter your password"
        required
        autoComplete="current-password"
        icon={<LockIcon />}
        labelRight={
          <Link
            href="/auth/forgot-password"
            className="text-sm hover:underline"
            style={{ color: theme.accentGold }}
          >
            Forgot password?
          </Link>
        }
        rightSlot={
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="text-neutral-500 hover:text-foreground"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            suppressHydrationWarning
          >
            👁
          </button>
        }
      />
      <div className="flex items-center gap-3">
        <input
          id="remember"
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          className={`rounded bg-black text-[${theme.accentGoldFocus}] focus:ring-[${theme.accentGoldFocus}]`}
          style={{ borderColor: theme.inputBorder }}
          suppressHydrationWarning
        />
        <label htmlFor="remember" className="text-sm text-white cursor-default select-none">
          Remember me
        </label>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-lg font-medium text-black transition-colors disabled:opacity-60 cursor-pointer select-none"
        style={{ backgroundColor: theme.accentGold }}
        suppressHydrationWarning
      >
        {loading ? 'Logging in…' : 'Log in'}
      </button>
    </form>
  )
}
