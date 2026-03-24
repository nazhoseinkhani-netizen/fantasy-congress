'use client'

import { useEffect } from 'react'
import { motion, useSpring, useTransform, AnimatePresence } from 'motion/react'

interface AnimatedCounterProps {
  value: number
  duration?: number
  className?: string
  formatFn?: (n: number) => string
}

export function AnimatedCounter({
  value,
  duration = 1.5,
  className,
  formatFn = (n) => Math.round(n).toLocaleString(),
}: AnimatedCounterProps) {
  const spring = useSpring(0, { stiffness: 60, damping: 15 })

  useEffect(() => {
    spring.set(value)
  }, [spring, value])

  const display = useTransform(spring, (latest) => formatFn(latest))

  return <motion.span className={className}>{display}</motion.span>
}

function DigitChar({ digit }: { digit: string }) {
  // Non-digit characters (comma, period, space) rendered without animation
  const isDigit = /\d/.test(digit)

  if (!isDigit) {
    return <span style={{ display: 'inline-block', verticalAlign: 'top' }}>{digit}</span>
  }

  return (
    <span
      style={{
        display: 'inline-block',
        overflow: 'hidden',
        height: '1em',
        verticalAlign: 'top',
      }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={digit}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{ display: 'block' }}
        >
          {digit}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

interface DigitFlipCounterProps {
  value: number
  className?: string
}

export function DigitFlipCounter({ value, className }: DigitFlipCounterProps) {
  const chars = Math.round(value).toLocaleString().split('')

  return (
    <span className={className} style={{ display: 'inline-flex', alignItems: 'flex-start' }}>
      {chars.map((char, i) => (
        <DigitChar key={i} digit={char} />
      ))}
    </span>
  )
}
