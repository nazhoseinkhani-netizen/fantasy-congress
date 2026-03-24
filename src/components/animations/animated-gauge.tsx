'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'motion/react'

type GaugeSize = 'sm' | 'md' | 'lg'

interface AnimatedGaugeProps {
  score: number
  size?: GaugeSize
  showLabel?: boolean
  labelText?: string
  animateOnMount?: boolean
  className?: string
}

const SIZE_MAP: Record<GaugeSize, number> = {
  sm: 80,
  md: 120,
  lg: 160,
}

const RADIUS = 40
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function getTierLabel(score: number): string {
  if (score <= 14) return 'Clean'
  if (score <= 34) return 'Minor'
  if (score <= 59) return 'Raised'
  if (score <= 84) return 'Suspicious'
  return 'Peak Swamp'
}

export function AnimatedGauge({
  score,
  size = 'md',
  showLabel = false,
  labelText,
  animateOnMount = true,
  className,
}: AnimatedGaugeProps) {
  const px = SIZE_MAP[size]
  const progress = useMotionValue(0)
  const [showScore, setShowScore] = useState(!animateOnMount)

  useEffect(() => {
    if (animateOnMount) {
      const controls = animate(progress, score, {
        type: 'spring',
        stiffness: 120,
        damping: 10,
      })
      return () => controls.stop()
    } else {
      progress.set(score)
    }
  }, [score, animateOnMount, progress])

  useEffect(() => {
    const unsubscribe = progress.on('change', (v) => {
      if (v >= score * 0.95) {
        setShowScore(true)
      }
    })
    return unsubscribe
  }, [progress, score])

  const dashOffset = useTransform(progress, [0, 100], [CIRCUMFERENCE, 0])
  const color = useTransform(
    progress,
    [0, 40, 70, 100],
    ['#22c55e', '#eab308', '#f97316', '#ef4444']
  )

  const tierName = getTierLabel(score)

  return (
    <svg
      viewBox="0 0 100 60"
      className={className}
      style={{ width: px, height: px * 0.6 }}
      aria-label={`Insider risk score: ${score} — ${tierName}`}
    >
      {/* Track circle */}
      <circle
        cx="50"
        cy="50"
        r={RADIUS}
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.1}
        strokeWidth={8}
        strokeDasharray={CIRCUMFERENCE}
        strokeLinecap="round"
        transform="rotate(-180 50 50)"
      />
      {/* Animated fill circle */}
      <motion.circle
        cx="50"
        cy="50"
        r={RADIUS}
        fill="none"
        stroke={color as unknown as string}
        strokeWidth={8}
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        transform="rotate(-180 50 50)"
      />
      {/* Score label */}
      {showLabel && showScore && (
        <>
          <text
            x="50"
            y="52"
            textAnchor="middle"
            fill="currentColor"
            className="text-xs font-bold"
            fontSize="12"
            fontWeight="bold"
          >
            {Math.round(progress.get())}
          </text>
          <text
            x="50"
            y="58"
            textAnchor="middle"
            fill="currentColor"
            fontSize="7"
            opacity={0.6}
          >
            {labelText ?? tierName}
          </text>
        </>
      )}
    </svg>
  )
}
