'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import HexBackground from '@/components/ui/HexBackground'
import { HexagonCard, AuthLinks } from '@/components/auth/shared'
import { theme } from '@/lib/theme'

const RESEND_COOLDOWN_SEC = 48

export default function EmailSentPage() {
  const [secondsLeft, setSecondsLeft] = useState(RESEND_COOLDOWN_SEC)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? sessionStorage.getItem('forgot-password-email-sent-at') : null
    const sentAt = stored ? parseInt(stored, 10) : Date.now()
    if (!stored) {
      sessionStorage.setItem('forgot-password-email-sent-at', String(Date.now()))
    }
    const elapsed = Math.floor((Date.now() - sentAt) / 1000)
    const initial = Math.max(0, RESEND_COOLDOWN_SEC - elapsed)
    setSecondsLeft(initial)
  }, [])

  useEffect(() => {
    if (secondsLeft <= 0) return
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [secondsLeft])

  function handleResend() {
    const email = typeof window !== 'undefined' ? sessionStorage.getItem('forgot-password-email') : null
    if (!email || loading || secondsLeft > 0) return
    setLoading(true)
    setTimeout(() => {
      sessionStorage.setItem('forgot-password-email-sent-at', String(Date.now()))
      setSecondsLeft(RESEND_COOLDOWN_SEC)
      setLoading(false)
    }, 800)
  }

  const canResend = secondsLeft === 0

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: theme.bgDark }}>
      <div
        className="absolute top-0 left-0 right-0 z-0"
        style={{
          height: '220px',
          background: theme.authBandGradient,
        }}
      >
        <HexBackground />
      </div>
      <div className="fixed inset-0 -z-10" style={{ background: theme.bgDark }} />
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12 pt-16">
        <div className="w-full max-w-3xl">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <Image src="/images/Brand.png" alt="" width={120} height={48} className="h-12 w-auto object-contain" />
            </div>
          </div>

          <h1 className="text-xl font-semibold text-white text-center mb-2">Forgot your password?</h1>
          <p className="text-neutral-400 text-sm text-center mb-6 max-w-md mx-auto">
            Enter the email address that you use for your account and we&apos;ll send you a password reset link.
          </p>

          <HexagonCard size="compact">
            <div className="w-full max-w-md flex flex-col items-center text-center">
              <div className="w-14 h-14 flex items-center justify-center rounded-full border-2 border-neutral-500 text-neutral-400 mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-white mb-2">Reset email has been sent.</h2>
              <p className="text-neutral-400 text-sm mb-6 max-w-sm mx-auto">
                We&apos;ve sent you an email which you can use to reset your password. Check your spam folder if you haven&apos;t received it after a few minutes.
              </p>
              <button
                type="button"
                onClick={handleResend}
                disabled={!canResend || loading}
                className="w-full py-3 rounded-lg font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer select-none border text-white"
                style={{
                  borderColor: theme.inputBorder,
                  backgroundColor: canResend ? theme.accentGold : 'transparent',
                  color: canResend ? '#000' : undefined,
                }}
                suppressHydrationWarning
              >
                {loading
                  ? 'Sending…'
                  : canResend
                    ? 'Resend email'
                    : `Resend email in (${secondsLeft}s)`}
              </button>
            </div>
          </HexagonCard>

          <AuthLinks
            primaryText="Back to "
            primaryHref="/auth/login"
            primaryLinkLabel="Log in"
            backHref="/"
            backLabel="Home page"
          />
        </div>
      </div>
    </div>
  )
}
