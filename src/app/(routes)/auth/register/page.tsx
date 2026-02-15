import Image from 'next/image'
import HexBackground from '@/components/ui/HexBackground'
import { HexagonCard, AuthLinks } from '@/components/auth/shared'
import { RegisterForm } from '@/components/auth/register'
import { theme } from '@/lib/theme'

export default function RegisterPage() {
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
              <Image src="/images/brand.png" alt="" width={120} height={48} className="h-12 w-auto object-contain" />
            </div>
          </div>
          <h1 className="text-xl font-semibold text-white text-center mb-6 cursor-crosshair select-none">  Join Trace of the Tide
          </h1>
          <HexagonCard>
            <RegisterForm />
          </HexagonCard>

          <AuthLinks
            primaryText="Already have an account?"
            primaryHref="/auth/login"
            primaryLinkLabel="Login"
            backHref="/"
            backLabel="Home page"
          />
        </div>
      </div>
    </div>
  )
}
