'use client'

import { useId } from 'react'

export default function HexBackground() {
  const id = useId()
  const patternId = `hexagons-${id.replace(/:/g, '')}`
  const gradientId = `hex-fade-${id.replace(/:/g, '')}`
  const maskId = `hex-mask-${id.replace(/:/g, '')}`

  return (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMin slice">
      <defs>
        <pattern id={patternId} x="0" y="0" width="168" height="72" patternUnits="userSpaceOnUse">
          <path d="M21 0l21 12v24L21 48 0 36V12L21 0zM63 0l21 12v24L63 48 42 36V12L63 0zM105 0l21 12v24L105 48 84 36V12L105 0zM147 0l21 12v24L147 48 126 36V12L147 0z" fill="none" stroke="#6b6b6b" strokeWidth="0.5" strokeOpacity="0.2" />
          <path d="M42 36l21 12v24L42 84L21 72V48L42 36zM84 36l21 12v24L84 84L63 72V48L84 36zM126 36l21 12v24L126 84L105 72V48L126 36z" fill="none" stroke="#6b6b6b" strokeWidth="0.5" strokeOpacity="0.2" />
        </pattern>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="70%" stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <mask id={maskId}>
          <rect width="100%" height="100%" fill={`url(#${gradientId})`} />
        </mask>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} mask={`url(#${maskId})`} />
    </svg>
  )
}
