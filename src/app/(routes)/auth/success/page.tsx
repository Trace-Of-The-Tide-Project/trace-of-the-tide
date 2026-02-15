import Image from 'next/image'
import Link from 'next/link'
import HexBackground from '@/components/ui/HexBackground'
import { HexagonCard } from '@/components/auth/shared'
import { theme } from '@/lib/theme'

export default function SuccessPage() {
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

          <HexagonCard>
            <div className="w-full max-w-md flex flex-col items-center text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-6 bg-green-500"
                aria-hidden
              >
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-white mb-2">You changed password successfully!</h1>
              <p className="text-neutral-400 text-sm mb-8 max-w-sm mx-auto">
                You can now log in with your new password.
              </p>
              <Link
                href="/auth/login"
                className="w-full py-3 rounded-lg font-medium text-white text-center transition-colors hover:opacity-90 cursor-pointer select-none block"
                style={{ backgroundColor: theme.cardBorder }}
              >
                Log in to your account
              </Link>
              <p className="text-neutral-400 text-sm mt-8">
                If you have any questions{' '}
                <Link href="/contact" className="hover:underline" style={{ color: theme.accentGold }}>
                  Contact us
                </Link>
              </p>
            </div>
          </HexagonCard>
        </div>
      </div>
    </div>
  )
}
