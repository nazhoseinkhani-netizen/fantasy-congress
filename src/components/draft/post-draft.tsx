'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Link from 'next/link'
import { TrendingUp } from 'lucide-react'
import type { Politician } from '@/types'
import type { DraftGrade, DraftTeam, SleeperPick } from '@/types/draft'
import { DRAFT_CONFIG } from '@/types/draft'
import { useDraftStore } from '@/store/draft-store'
import { useGameStore } from '@/store/game-store'
import { gradeDraftTeam, generateGradeWriteup, findSleeperPicks } from '@/lib/draft/grading'
import { loadDemoState } from '@/lib/data/demo'
import { Button } from '@/components/ui/button'
import { PARTY_COLORS } from '@/lib/party-colors'
import { cn } from '@/lib/utils'

interface PostDraftProps {
  politicians: Map<string, Politician>
}

interface ComputedGrade extends DraftGrade {
  writeup: string
}

function gradeLetterColor(letter: string): string {
  if (letter.startsWith('A')) return 'text-emerald-400'
  if (letter.startsWith('B')) return 'text-blue-400'
  if (letter.startsWith('C')) return 'text-amber-400'
  return 'text-red-400'
}

function gradeLetterBg(letter: string): string {
  if (letter.startsWith('A')) return 'bg-emerald-500/10 border-emerald-500/30'
  if (letter.startsWith('B')) return 'bg-blue-500/10 border-blue-500/30'
  if (letter.startsWith('C')) return 'bg-amber-500/10 border-amber-500/30'
  return 'bg-red-500/10 border-red-500/30'
}

export function PostDraft({ politicians }: PostDraftProps) {
  const teams = useDraftStore((s) => s.teams)
  const picks = useDraftStore((s) => s.picks)
  const userTeamIndex = useDraftStore((s) => s.userTeamIndex)
  const resetDraft = useDraftStore((s) => s.resetDraft)

  const [grades, setGrades] = useState<ComputedGrade[]>([])
  const [sleepers, setSleepers] = useState<SleeperPick[]>([])
  const [expandedCell, setExpandedCell] = useState<string | null>(null)
  const [rosterSaved, setRosterSaved] = useState(false)

  useEffect(() => {
    if (teams.length === 0 || picks.length === 0) return

    // Compute grades for all teams
    const computedGrades: ComputedGrade[] = teams.map((team) => {
      const rosterPoliticians = team.roster
        .map((id) => politicians.get(id))
        .filter((p): p is Politician => p !== undefined)

      const gradeBase = gradeDraftTeam(rosterPoliticians, DRAFT_CONFIG.SALARY_CAP)

      // Find top pick (highest season points in roster)
      const topPick = rosterPoliticians.reduce(
        (best, p) => (p.seasonPoints > (politicians.get(best)?.seasonPoints ?? 0) ? p.bioguideId : best),
        rosterPoliticians[0]?.bioguideId ?? ''
      )

      const grade: DraftGrade = {
        teamIndex: team.index,
        letter: gradeBase.letter,
        score: gradeBase.score,
        writeup: '',
        topPick,
        salaryEfficiency: gradeBase.salaryEfficiency,
      }

      const writeup = generateGradeWriteup(grade, team, rosterPoliticians)

      return { ...grade, writeup }
    })

    setGrades(computedGrades)

    // Find sleeper picks
    const sleeperPicks = findSleeperPicks(picks, politicians)
    setSleepers(sleeperPicks)

    // Save user's drafted roster to game store
    if (!rosterSaved) {
      const userTeam = teams[userTeamIndex]
      if (userTeam && userTeam.roster.length > 0) {
        const activeIds = userTeam.roster.slice(0, DRAFT_CONFIG.ACTIVE_SLOTS)
        const benchIds = userTeam.roster.slice(DRAFT_CONFIG.ACTIVE_SLOTS)

        // Load demo state to get user team ID for game store
        loadDemoState().then((demo) => {
          const userTeamId = demo.userTeamId
          if (userTeamId) {
            useGameStore.setState((state) => ({
              rosterOverrides: {
                ...state.rosterOverrides,
                [userTeamId]: { active: activeIds, bench: benchIds },
              },
            }))
            setRosterSaved(true)
          }
        })
      }
    }
  }, [teams, picks, politicians, userTeamIndex, rosterSaved])

  // Build picks by round and team for the grid
  const pickGrid: Record<number, Record<number, string>> = {}
  for (const pick of picks) {
    if (!pickGrid[pick.round]) pickGrid[pick.round] = {}
    pickGrid[pick.round][pick.teamIndex] = pick.bioguideId
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-12">

        {/* Section 1: DRAFT COMPLETE header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h1 className="text-5xl font-black tracking-tight text-foreground uppercase">
            DRAFT COMPLETE
          </h1>
          <p className="text-muted-foreground text-lg">
            All {DRAFT_CONFIG.TOTAL_PICKS} picks are in. Here&apos;s how everyone did.
          </p>
          {rosterSaved && (
            <p className="text-xs text-emerald-500 font-medium">
              Your roster has been saved to My Team
            </p>
          )}
        </motion.div>

        {/* Section 2: Pick-by-Pick Draft Board */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Draft Board
          </h2>
          <div className="overflow-x-auto">
            <div className="min-w-[640px]">
              {/* Team header row */}
              <div className="grid grid-cols-[60px_1fr_1fr_1fr_1fr] gap-px mb-px">
                <div />
                {teams.map((team) => (
                  <div
                    key={team.index}
                    className={cn(
                      'text-center py-2 px-2 rounded-t-lg text-xs font-bold uppercase tracking-wider',
                      team.index === userTeamIndex
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    <p className="truncate">{team.name}</p>
                    {team.isUser && (
                      <span className="text-[9px] text-amber-500">YOU</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Round rows */}
              {Array.from({ length: DRAFT_CONFIG.ROUNDS }, (_, roundIdx) => (
                <div
                  key={roundIdx}
                  className="grid grid-cols-[60px_1fr_1fr_1fr_1fr] gap-px mb-px"
                >
                  {/* Round label */}
                  <div className="flex items-center justify-center text-xs font-medium text-muted-foreground">
                    Round {roundIdx + 1}
                  </div>

                  {/* Team pick cells */}
                  {teams.map((team) => {
                    const bioguideId = pickGrid[roundIdx]?.[team.index]
                    const politician = bioguideId ? politicians.get(bioguideId) : undefined
                    const cellKey = `${roundIdx}-${team.index}`
                    const isExpanded = expandedCell === cellKey
                    const pickNumber = picks.find(
                      (p) => p.round === roundIdx && p.teamIndex === team.index
                    )?.pickNumber

                    const partyColor = politician
                      ? (PARTY_COLORS[politician.party] ?? PARTY_COLORS['I'])
                      : '#888'

                    return (
                      <div
                        key={team.index}
                        className={cn(
                          'relative bg-card border border-border rounded cursor-pointer transition-all hover:ring-1 hover:ring-primary/40',
                          team.index === userTeamIndex && 'border-amber-500/30 bg-amber-500/5',
                        )}
                        style={{ borderLeft: `3px solid ${partyColor}` }}
                        onClick={() => setExpandedCell(isExpanded ? null : cellKey)}
                      >
                        {politician ? (
                          <div className="p-2">
                            {/* Compact view */}
                            <div className="flex items-center gap-1.5">
                              {pickNumber !== undefined && (
                                <span className="text-[9px] text-muted-foreground/60 font-medium shrink-0">
                                  #{pickNumber + 1}
                                </span>
                              )}
                              <div className="relative size-6 overflow-hidden rounded-full bg-muted shrink-0">
                                <img
                                  src={politician.photoUrl}
                                  alt={politician.name}
                                  loading="lazy"
                                  className="size-full object-cover object-center"
                                  onError={(e) => {
                                    const t = e.target as HTMLImageElement
                                    t.style.display = 'none'
                                  }}
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-medium truncate leading-tight">
                                  {politician.name.split(' ').pop()}
                                </p>
                                <p className="text-[10px] text-muted-foreground truncate">
                                  {politician.seasonPoints.toFixed(0)} pts
                                </p>
                              </div>
                            </div>

                            {/* Expanded view */}
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                >
                                  <div className="pt-2 mt-2 border-t border-border space-y-1">
                                    <p className="text-xs font-semibold">{politician.name}</p>
                                    <p className="text-[10px] text-muted-foreground">
                                      {politician.party} &middot; {politician.state} &middot;{' '}
                                      {politician.chamber === 'senate' ? 'Senate' : 'House'}
                                    </p>
                                    <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 mt-1">
                                      <div className="text-[10px]">
                                        <span className="text-muted-foreground">Salary: </span>
                                        <span className="font-medium">
                                          ${politician.salaryCap.toLocaleString()}
                                        </span>
                                      </div>
                                      <div className="text-[10px]">
                                        <span className="text-muted-foreground">Pts: </span>
                                        <span className="font-medium">
                                          {politician.seasonPoints.toFixed(1)}
                                        </span>
                                      </div>
                                      <div className="text-[10px]">
                                        <span className="text-muted-foreground">Risk: </span>
                                        <span className="font-medium">
                                          {politician.insiderRiskScore}
                                        </span>
                                      </div>
                                      <div className="text-[10px]">
                                        <span className="text-muted-foreground">Trades: </span>
                                        <span className="font-medium">{politician.tradeCount}</span>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ) : (
                          <div className="p-2 h-12 flex items-center justify-center">
                            <span className="text-xs text-muted-foreground/40">—</span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground/60 text-center">
            Click any cell to expand details
          </p>
        </div>

        {/* Section 3: Draft Grades */}
        {grades.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Draft Grades
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {grades.map((grade, i) => {
                const team = teams[grade.teamIndex]
                const topPolitician = politicians.get(grade.topPick)
                const isUserTeam = grade.teamIndex === userTeamIndex

                return (
                  <motion.div
                    key={grade.teamIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15 }}
                    className={cn(
                      'rounded-xl border p-4 space-y-3',
                      isUserTeam
                        ? 'border-amber-500/40 bg-amber-500/5 ring-2 ring-amber-500/30'
                        : 'border-border bg-card'
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold leading-tight">{team?.name ?? `Team ${grade.teamIndex + 1}`}</p>
                      {isUserTeam && (
                        <span className="text-[9px] font-bold text-amber-500 uppercase tracking-wider shrink-0">
                          You
                        </span>
                      )}
                    </div>

                    {/* Letter grade */}
                    <div className="flex flex-col items-center gap-1">
                      <div
                        className={cn(
                          'text-5xl font-black rounded-xl border px-4 py-2',
                          gradeLetterBg(grade.letter),
                          gradeLetterColor(grade.letter)
                        )}
                      >
                        {grade.letter}
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        Score: {grade.score}/100
                      </p>
                    </div>

                    {/* Write-up */}
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {grade.writeup}
                    </p>

                    {/* Stats */}
                    <div className="space-y-1 text-xs border-t border-border pt-2">
                      {topPolitician && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Top Pick</span>
                          <span className="font-medium truncate max-w-[120px]">
                            {topPolitician.name.split(' ').pop()}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Efficiency</span>
                        <span className="font-medium">
                          {grade.salaryEfficiency.toFixed(1)} pts/$1K
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}

        {/* Section 4: Sleeper Picks */}
        {sleepers.length > 0 && (
          <div className="space-y-4">
            <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              <TrendingUp className="size-4 text-emerald-500" />
              SLEEPER PICKS
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {sleepers.map((sleeper) => {
                const politician = politicians.get(sleeper.bioguideId)
                const team = teams[sleeper.teamIndex]
                const partyColor = politician
                  ? (PARTY_COLORS[politician.party] ?? PARTY_COLORS['I'])
                  : '#888'

                if (!politician) return null

                return (
                  <div
                    key={`${sleeper.pickNumber}-${sleeper.bioguideId}`}
                    className="flex-shrink-0 w-52 rounded-xl border border-border bg-card p-3 space-y-2"
                    style={{ borderLeft: `3px solid ${partyColor}` }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="relative size-10 overflow-hidden rounded-full bg-muted shrink-0">
                        <img
                          src={politician.photoUrl}
                          alt={politician.name}
                          loading="lazy"
                          className="size-full object-cover object-center"
                          onError={(e) => {
                            const t = e.target as HTMLImageElement
                            t.style.display = 'none'
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{politician.name}</p>
                        <span
                          className="text-xs font-bold"
                          style={{ color: partyColor }}
                        >
                          {politician.party}
                        </span>
                      </div>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      Drafted by {team?.name ?? `Team ${sleeper.teamIndex + 1}`}
                    </p>
                    <p className="text-xs text-muted-foreground leading-snug">
                      {sleeper.reason}
                    </p>
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-border">
                      <span className="text-muted-foreground">
                        {politician.seasonPoints.toFixed(1)} pts
                      </span>
                      <span className="text-muted-foreground">
                        ${politician.salaryCap.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Section 5: Actions */}
        <div className="flex items-center justify-center gap-4 pt-4 border-t border-border">
          <Button
            size="lg"
            onClick={resetDraft}
            className="font-bold"
          >
            Draft Again
          </Button>
          <Link
            href="/team"
            className="inline-flex items-center justify-center h-9 px-4 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            View My Team
          </Link>
        </div>
      </div>
    </div>
  )
}
