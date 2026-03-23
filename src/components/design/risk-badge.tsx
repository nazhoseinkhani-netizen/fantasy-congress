'use client'

import type { InsiderRiskTier } from '@/types'
import { cn } from '@/lib/utils'

interface RiskBadgeProps {
  tier: InsiderRiskTier
  score: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const tierDisplayNames: Record<InsiderRiskTier, string> = {
  'clean-record': 'Clean Record',
  'minor-concerns': 'Minor Concerns',
  'raised-eyebrows': 'Raised Eyebrows',
  'seriously-suspicious': 'Seriously Suspicious',
  'peak-swamp': 'Peak Swamp',
}

const tierColorVars: Record<InsiderRiskTier, string> = {
  'clean-record': 'var(--risk-clean)',
  'minor-concerns': 'var(--risk-minor)',
  'raised-eyebrows': 'var(--risk-raised)',
  'seriously-suspicious': 'var(--risk-suspicious)',
  'peak-swamp': 'var(--risk-swamp)',
}

const sizeClasses: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'text-xs px-2 py-0.5 gap-1',
  md: 'text-sm px-2.5 py-1 gap-1.5',
  lg: 'text-base px-3 py-1.5 gap-2',
}

export function RiskBadge({ tier, score, size = 'md', className }: RiskBadgeProps) {
  const colorVar = tierColorVars[tier]
  const displayName = tierDisplayNames[tier]

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium border',
        sizeClasses[size],
        className
      )}
      style={{
        backgroundColor: `color-mix(in oklch, ${colorVar} 20%, transparent)`,
        color: colorVar,
        borderColor: `color-mix(in oklch, ${colorVar} 40%, transparent)`,
      }}
    >
      <span
        className="size-1.5 rounded-full shrink-0"
        style={{ backgroundColor: colorVar }}
      />
      <span>{displayName}</span>
      <span className="opacity-70 font-mono">{score}</span>
    </span>
  )
}
