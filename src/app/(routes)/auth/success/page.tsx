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
              <Image src="/images/Brand.png" alt="" width={120} height={48} className="h-12 w-auto object-contain" />
            </div>
          </div>

          <HexagonCard size="medium">
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
              <p className="text-neutral-400 text-sm mt-8 flex items-center justify-center gap-1.5 flex-wrap">
                If you have any questions
                <span className="inline-flex align-middle" aria-hidden>
                  <svg width="15" height="18" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0" style={{ color: theme.accentGold }}>
                    <path d="M0.75 9.91667V7.41667C0.75 5.64856 1.45238 3.95286 2.70262 2.70262C3.95286 1.45238 5.64856 0.75 7.41667 0.75C9.18478 0.75 10.8805 1.45238 12.1307 2.70262C13.381 3.95286 14.0833 5.64856 14.0833 7.41667V9.91667M0.75 9.91667C0.75 9.47464 0.925595 9.05072 1.23816 8.73816C1.55072 8.42559 1.97464 8.25 2.41667 8.25H3.25C3.69203 8.25 4.11595 8.42559 4.42851 8.73816C4.74107 9.05072 4.91667 9.47464 4.91667 9.91667V12.4167C4.91667 12.8587 4.74107 13.2826 4.42851 13.5952C4.11595 13.9077 3.69203 14.0833 3.25 14.0833H2.41667C1.97464 14.0833 1.55072 13.9077 1.23816 13.5952C0.925595 13.2826 0.75 12.8587 0.75 12.4167V9.91667ZM14.0833 9.91667C14.0833 9.47464 13.9077 9.05072 13.5952 8.73816C13.2826 8.42559 12.8587 8.25 12.4167 8.25H11.5833C11.1413 8.25 10.7174 8.42559 10.4048 8.73816C10.0923 9.05072 9.91667 9.47464 9.91667 9.91667V12.4167C9.91667 12.8587 10.0923 13.2826 10.4048 13.5952C10.7174 13.9077 11.1413 14.0833 11.5833 14.0833H12.4167M14.0833 9.91667V12.4167C14.0833 12.8587 13.9077 13.2826 13.5952 13.5952C13.2826 13.9077 12.8587 14.0833 12.4167 14.0833M12.4167 14.0833C12.4167 15.4642 10.1783 16.5833 7.41667 16.5833" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <Link href="/contact" className="hover:underline inline-flex" style={{ color: theme.accentGold }}>
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
