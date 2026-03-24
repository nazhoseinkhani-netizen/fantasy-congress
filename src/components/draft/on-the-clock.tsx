'use client'

import { motion } from 'motion/react'
import type { DraftTeam } from '@/types/draft'
import { DRAFT_CONFIG } from '@/types/draft'
import { cn } from '@/lib/utils'

interface OnTheClockProps {
  currentTeam: DraftTeam
  isUserTurn: boolean
  userPickTimer: number
  currentPickNumber: number
  totalPicks: number
  salaryRemaining?: number
  totalCap?: number
}

const ARCHETYPE_LABELS: Record<string, string> = {
  'value-hunter': 'Value Hunter',
  'corruption-chaser': 'Corruption Chaser',
  'party-loyalist': 'Party Loyalist',
  'balanced': 'Balanced',
  'human': 'Human',
}

export function OnTheClock({
  currentTeam,
  isUserTurn,
  userPickTimer,
  currentPickNumber,
  totalPicks,
  salaryRemaining,
  totalCap,
}: OnTheClockProps) {
  const round = Math.floor(currentPickNumber / DRAFT_CONFIG.TEAM_COUNT) + 1
  const timerColor =
    userPickTimer > 30 ? 'text-emerald-500' : userPickTimer > 10 ? 'text-amber-500' : 'text-red-500'

  return (
    <div className="flex flex-col border-l border-r border-border h-full">
      {/* ON THE CLOCK banner */}
      <motion.div
        className="px-6 py-4 text-center border-b border-border"
        animate={{
          backgroundColor: isUserTurn
            ? 'hsl(var(--primary) / 0.15)'
            : 'hsl(var(--muted) / 0.5)',
        }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-xs font-bold tracking-[0.3em] uppercase text-muted-foreground mb-1">
          ON THE CLOCK
        </p>
        <h2
          className={cn(
            'text-xl font-bold truncate',
            isUserTurn ? 'text-primary' : 'text-foreground'
          )}
        >
          {currentTeam.name}
        </h2>
        {isUserTurn && (
          <p className="text-sm font-bold text-primary mt-0.5">YOUR PICK</p>
        )}
      </motion.div>

      {/* Drafter info */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 p-6">
        {isUserTurn ? (
          /* User turn: timer */
          <div className="flex flex-col items-center gap-3">
            <motion.div
              key={userPickTimer}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className={cn('text-7xl font-black tabular-nums', timerColor)}
            >
              {userPickTimer}
            </motion.div>
            <p className="text-sm text-muted-foreground">seconds to pick</p>
            <p className="text-xs text-muted-foreground/60">
              Best available auto-picked on expiry
            </p>
          </div>
        ) : (
          /* AI turn: thinking animation */
          <div className="flex flex-col items-center gap-4">
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                {ARCHETYPE_LABELS[currentTeam.archetype] ?? currentTeam.archetype}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Thinking...</p>
            <div className="flex items-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="size-2.5 rounded-full bg-muted-foreground/50 animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Pick progress */}
        <div className="text-center space-y-1">
          <p className="text-sm font-medium text-muted-foreground">
            Pick {currentPickNumber + 1} of {totalPicks}
          </p>
          <p className="text-xs text-muted-foreground/60">
            Round {round} of {DRAFT_CONFIG.ROUNDS}
          </p>
        </div>

        {/* Salary cap — shown when it's user's turn */}
        {isUserTurn && salaryRemaining !== undefined && totalCap !== undefined && (
          <div className="w-full px-2 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-muted-foreground">Salary Cap</span>
              <span className={cn(
                'font-mono font-bold',
                salaryRemaining < totalCap * 0.2 ? 'text-red-400' : 'text-emerald-400'
              )}>
                ${salaryRemaining.toLocaleString()} left
              </span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all',
                  salaryRemaining < totalCap * 0.2 ? 'bg-red-500' : 'bg-emerald-500'
                )}
                style={{ width: `${Math.max(0, (salaryRemaining / totalCap) * 100)}%` }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground/60 text-center">
              ${currentTeam.salaryUsed.toLocaleString()} / ${totalCap.toLocaleString()} used
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
