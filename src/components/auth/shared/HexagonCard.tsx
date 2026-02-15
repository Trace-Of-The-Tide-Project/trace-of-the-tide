'use client'

import { theme } from '@/lib/theme'

const HEX_CLIP = 'polygon(50% 0%, 100% 20%, 100% 80%, 50% 100%, 0% 80%, 0% 20%)'

type HexagonCardProps = {
  children: React.ReactNode
  className?: string
  /** Use a smaller card (e.g. for forgot-password with just the form) */
  compact?: boolean
}

export function HexagonCard({ children, className, compact }: HexagonCardProps) {
  return (
    <div
      className={`relative w-full mx-auto ${compact ? 'max-w-md min-h-0' : 'max-w-[680px] min-h-[700px]'} ${className ?? ''}`}
      style={{
        clipPath: HEX_CLIP,
        background: theme.cardBorder,
        padding: '3px',
      }}
    >
      <div
        className={`relative w-full flex flex-col items-center justify-center ${compact ? 'min-h-0 p-8' : 'h-full min-h-[calc(700px-6px)] p-12'}`}
        style={{
          clipPath: HEX_CLIP,
          background: theme.cardBg,
          boxShadow: `inset 0 0 0 1px ${theme.cardInnerGlow}`,
        }}
      >
        {children}
      </div>
    </div>
  )
}
