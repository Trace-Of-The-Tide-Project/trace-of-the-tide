'use client'

import { theme } from '@/lib/theme'

const HEX_CLIP = 'polygon(50% 0%, 100% 20%, 100% 80%, 50% 100%, 0% 80%, 0% 20%)'

const SIZE_STYLES = {
  default: {
    outer: 'max-w-3xl min-h-[760px]',
    inner: 'h-full min-h-[calc(760px-6px)] p-14',
  },
  compact: {
    outer: 'max-w-xl min-h-[520px]',
    inner: 'h-full min-h-[calc(520px-6px)] p-10',
  },
  medium: {
    outer: 'max-w-2xl min-h-[640px]',
    inner: 'h-full min-h-[calc(640px-6px)] p-12',
  },
  large: {
    outer: 'max-w-3xl min-h-[760px]',
    inner: 'h-full min-h-[calc(760px-6px)] p-14',
  },
} as const

export type HexagonCardSize = keyof typeof SIZE_STYLES

type HexagonCardProps = {
  children: React.ReactNode
  className?: string
  /** Card size: default (full), compact (small), medium, or large */
  size?: HexagonCardSize
  /** @deprecated Use size="compact" instead */
  compact?: boolean
}

export function HexagonCard({ children, className, size, compact }: HexagonCardProps) {
  const effectiveSize = size ?? (compact ? 'compact' : 'default')
  const styles = SIZE_STYLES[effectiveSize]

  return (
    <div
      className={`relative w-full mx-auto ${styles.outer} ${className ?? ''}`}
      style={{
        clipPath: HEX_CLIP,
        background: theme.cardBorder,
        padding: '3px',
      }}
    >
      <div
        className={`relative w-full flex flex-col items-center justify-center ${styles.inner}`}
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
