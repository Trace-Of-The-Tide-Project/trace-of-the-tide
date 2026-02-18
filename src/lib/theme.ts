/**
 * Project-wide theme constants.
 * Import from '@/lib/theme' to keep colors and layout consistent.
 */

export const theme = {
  /** Primary gold for buttons, links, accents */
  accentGold: '#CBA158',
  /** Slightly lighter gold for focus rings, borders, checkboxes */
  accentGoldFocus: '#C9A96E',

  /** Page background (black) */
  bgDark: '#000000',
  /** Auth top band gradient (dark charcoal → black) */
  authBandGradient: 'linear-gradient(to bottom, #252525 0%, #1a1a1a 50%, #000000 100%)',

  /** Input and checkbox border */
  inputBorder: '#525252',

  /** Hexagon card: outer border color */
  cardBorder: '#333333',
  /** Hexagon card: inner fill */
  cardBg: '#000000',
  /** Hexagon card: inner glow (gold tint) */
  cardInnerGlow: 'rgba(203,161,88,0.15)',
} as const

export type Theme = typeof theme
