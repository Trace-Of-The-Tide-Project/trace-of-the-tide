import { Suspense } from 'react'
import Image from 'next/image'
import HexBackground from '@/components/ui/HexBackground'
import { HexagonCard, AuthLinks } from '@/components/auth/shared'
import { LoginForm } from '@/components/auth/login'
import { theme } from '@/lib/theme'

export default function LoginPage() {
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
          <h1 className="text-xl font-semibold text-white text-center mb-6 cursor-default select-none">Welcome Back!</h1>

          <HexagonCard>
            <Suspense fallback={<div className="w-full max-w-md h-64 animate-pulse rounded-lg bg-white/5" />}>
              <LoginForm />
            </Suspense>
          </HexagonCard>

          <AuthLinks
            primaryText="Don&apos;t have an account?"
            primaryHref="/auth/register"
            primaryLinkLabel="Sign up"
            backHref="/"
            backLabel="Home page"
          />
        </div>
      </div>
    </div>
  )
}
