'use client'

import { cn } from '@/lib/utils'
import { useGameStore } from '@/store/game-store'

interface WeekSelectorProps {
  totalWeeks?: number
}

export function WeekSelector({ totalWeeks = 6 }: WeekSelectorProps) {
  const selectedWeek = useGameStore((s) => s.selectedWeek)
  const setSelectedWeek = useGameStore((s) => s.setSelectedWeek)

  return (
    <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit">
      {Array.from({ length: totalWeeks }, (_, i) => i + 1).map((week) => (
        <button
          key={week}
          onClick={() => setSelectedWeek(week)}
          className={cn(
            'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
            selectedWeek === week
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          Wk {week}
        </button>
      ))}
    </div>
  )
}
