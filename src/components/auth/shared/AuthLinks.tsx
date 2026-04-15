'use client'

import Link from 'next/link'
import { theme } from '@/lib/theme'

type AuthLinksProps = {
  /** Primary CTA text, e.g. "Already have an account? Login" */
  primaryText: React.ReactNode
  primaryHref: string
  primaryLinkLabel: string
  /** Secondary link, e.g. "Back to Home page" */
  backHref?: string
  backLabel?: string
}

export function AuthLinks({
  primaryText,
  primaryHref,
  primaryLinkLabel,
  backHref = '/',
  backLabel = 'Home page',
}: AuthLinksProps) {
  return (
    <>
      <p className="text-center mt-6 text-foreground text-sm cursor-default select-none">
        {primaryText}{' '}
        <Link href={primaryHref} className="hover:underline cursor-pointer" style={{ color: theme.accentGold }}>
          {primaryLinkLabel}
        </Link>
      </p>
      <div className="text-center mt-6">
        <span className="text-sm text-foreground cursor-default select-none">Back to </span>
        <Link href={backHref} className="text-sm hover:underline cursor-pointer" style={{ color: theme.accentGold }}>
          {backLabel}
        </Link>
      </div>
    </>
  )
}
