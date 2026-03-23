import type { Politician } from '@/types/politician'
import type { DraftGrade, DraftTeam, DraftPick, SleeperPick } from '@/types/draft'

/**
 * Compute post-draft grade for a team's roster.
 * Returns DraftGrade minus teamIndex and topPick — caller sets those.
 */
export function gradeDraftTeam(
  roster: Politician[],
  totalCap: number
): Omit<DraftGrade, 'teamIndex' | 'topPick' | 'writeup'> {
  if (roster.length === 0) {
    return { letter: 'F', score: 0, salaryEfficiency: 0 }
  }

  const salaryUsed = roster.reduce((sum, p) => sum + p.salaryCap, 0)
  const totalPoints = roster.reduce((sum, p) => sum + p.seasonPoints, 0)

  // Salary efficiency: points per $1000 spent
  const salaryEfficiency = salaryUsed > 0 ? totalPoints / (salaryUsed / 1_000) : 0

  // --- Component 1: Salary efficiency (50%) ---
  // Normalized 0-100 where 50 = average, 100 = 2x average
  // We estimate average efficiency as 10 points per $1000 (rough baseline)
  const AVERAGE_EFFICIENCY = 10
  const efficiencyNorm = Math.min(100, (salaryEfficiency / (AVERAGE_EFFICIENCY * 2)) * 100)
  const efficiencyScore = efficiencyNorm

  // --- Component 2: Roster balance (25%) ---
  // uniqueSalaryTiers.size / 4 * 100 (4 possible tiers in a 4-pick roster)
  const uniqueTiers = new Set(roster.map((p) => p.salaryTier))
  const balanceScore = (uniqueTiers.size / 4) * 100

  // --- Component 3: Ceiling (25%) ---
  // topScorerSeasonPoints / maxPossibleSeasonPoints * 100
  // Max possible is estimated at 300 points (top politicians in dataset)
  const MAX_POSSIBLE_SEASON_POINTS = 300
  const topScore = Math.max(...roster.map((p) => p.seasonPoints))
  const ceilingScore = Math.min(100, (topScore / MAX_POSSIBLE_SEASON_POINTS) * 100)

  // Composite score
  const composite = efficiencyScore * 0.5 + balanceScore * 0.25 + ceilingScore * 0.25
  const score = Math.round(Math.min(100, Math.max(0, composite)))

  // Letter grade mapping
  const letter = scoreToLetter(score)

  return { letter, score, salaryEfficiency }
}

function scoreToLetter(score: number): string {
  if (score >= 90) return 'A+'
  if (score >= 85) return 'A'
  if (score >= 80) return 'A-'
  if (score >= 75) return 'B+'
  if (score >= 70) return 'B'
  if (score >= 65) return 'B-'
  if (score >= 60) return 'C+'
  if (score >= 55) return 'C'
  if (score >= 50) return 'C-'
  if (score >= 40) return 'D'
  return 'F'
}

/**
 * Generate ESPN-style analyst commentary for a draft grade.
 */
export function generateGradeWriteup(
  grade: DraftGrade,
  team: DraftTeam,
  roster: Politician[]
): string {
  const teamName = team.name
  const topPolitician = roster.find((p) => p.bioguideId === grade.topPick)
  const topPickName = topPolitician?.name ?? 'their top pick'

  // Determine primary party makeup
  const partyCounts: Record<string, number> = {}
  for (const p of roster) {
    partyCounts[p.party] = (partyCounts[p.party] ?? 0) + 1
  }
  const primaryParty = Object.entries(partyCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'mixed'
  const partyLabel = primaryParty === 'D' ? 'Democrat-heavy' : primaryParty === 'R' ? 'Republican-heavy' : 'bipartisan'

  // Efficiency descriptor
  const efficiencyDesc =
    grade.salaryEfficiency > 15
      ? 'elite'
      : grade.salaryEfficiency > 10
        ? 'solid'
        : grade.salaryEfficiency > 5
          ? 'average'
          : 'below-average'

  const letter = grade.letter

  // Determine bracket and variant
  const bracket = getGradeBracket(letter)
  const variantIndex = grade.score % 3

  const templates: Record<string, string[]> = {
    'A-tier': [
      `${teamName} crushed this draft. Landing ${topPickName} was the steal of the night, and their ${efficiencyDesc} salary management leaves room for waiver wire moves. This ${partyLabel} roster has serious championship potential.`,
      `Absolutely masterful work by ${teamName}. ${topPickName} alone justifies the entire draft strategy, and the ${partyLabel} roster composition shows real vision. With ${efficiencyDesc} salary efficiency, expect this team to compete deep into the playoffs.`,
      `${teamName} came prepared and it showed. ${topPickName} at that price is daylight robbery, and their ${partyLabel} roster has the depth to weather any midseason scandal. Grade this one as a full-on success.`,
    ],
    'B-tier': [
      `${teamName} had a solid draft with no glaring mistakes. ${topPickName} gives them a reliable anchor, and their ${partyLabel} roster is balanced enough to compete. A few value plays could have pushed this to an A, but this is a playoff-caliber team.`,
      `Respectable showing from ${teamName}. ${topPickName} is exactly the kind of pick you want in round one, and their ${efficiencyDesc} salary efficiency keeps options open. The ${partyLabel} makeup adds some predictability to the scoring ceiling.`,
      `${teamName} drafted smart, not flashy. ${topPickName} headlines a ${partyLabel} roster that won't wow the league but won't embarrass anyone either. With ${efficiencyDesc} salary usage, they have the flexibility to improve at the wire.`,
    ],
    'C-tier': [
      `${teamName} had a draft that's best described as fine. ${topPickName} provides some upside, but the ${partyLabel} roster leans heavily on one outcome. The ${efficiencyDesc} salary efficiency suggests some overpays. Salvageable with the right waiver pickups.`,
      `Mixed results for ${teamName} tonight. There's talent here — ${topPickName} especially — but the ${partyLabel} construction leaves them vulnerable to bad weeks. At ${efficiencyDesc} salary efficiency, they'll need their stars to perform.`,
      `${teamName} leaves some value on the board. ${topPickName} is the clear standout on a ${partyLabel} roster that feels like a work in progress. Not a disaster, but the ${efficiencyDesc} salary efficiency will cost them when it counts.`,
    ],
    'D-tier': [
      `This wasn't the draft ${teamName} was hoping for. ${topPickName} is doing a lot of heavy lifting on a ${partyLabel} roster that reached in most rounds. The ${efficiencyDesc} salary efficiency makes rebuilding this mid-season an uphill battle.`,
      `Rough night for ${teamName}. The ${partyLabel} roster has a few names you recognize, but ${topPickName} aside, there's not much here that inspires confidence. With ${efficiencyDesc} salary efficiency, expect a long season.`,
      `${teamName} went a direction nobody expected — including them, probably. ${topPickName} is salvageable but the overall ${partyLabel} build and ${efficiencyDesc} salary usage suggests the league just got a free win most weeks. Better luck at the wire.`,
    ],
    'F-tier': [
      `${teamName} had one job tonight and, well... ${topPickName} is the only name worth mentioning on this ${partyLabel} roster. The ${efficiencyDesc} salary efficiency is a crime against the cap. This is a roster built to draft, not to win.`,
      `Historic. Not in a good way. ${teamName}'s ${partyLabel} roster and ${efficiencyDesc} salary management will be studied by future leagues as what NOT to do. ${topPickName} is somewhere crying a single tear. Full rebuild immediately.`,
      `Some drafts are works of art. This is not that. ${teamName} piled up ${partyLabel} salary bloat with ${efficiencyDesc} efficiency, and ${topPickName} can't carry this alone. The rest of the league should be sending thank you cards.`,
    ],
  }

  const bracketTemplates = templates[bracket]
  const writeup = bracketTemplates[variantIndex % bracketTemplates.length]
  return writeup
}

function getGradeBracket(letter: string): string {
  if (['A+', 'A', 'A-'].includes(letter)) return 'A-tier'
  if (['B+', 'B', 'B-'].includes(letter)) return 'B-tier'
  if (['C+', 'C', 'C-'].includes(letter)) return 'C-tier'
  if (letter === 'D') return 'D-tier'
  return 'F-tier'
}

/**
 * Find sleeper picks across all draft picks.
 * Sleepers = bench/sleeper tier politicians with high trade volume or recent hot streak.
 */
export function findSleeperPicks(
  picks: DraftPick[],
  politicians: Map<string, Politician>
): SleeperPick[] {
  // Calculate top 25% weekly max threshold across all politicians
  const allWeeklyMaxes: number[] = []
  for (const p of politicians.values()) {
    if (p.weeklyPoints && p.weeklyPoints.length > 0) {
      allWeeklyMaxes.push(Math.max(...p.weeklyPoints))
    }
  }
  allWeeklyMaxes.sort((a, b) => a - b)
  const top25pctThreshold =
    allWeeklyMaxes.length > 0
      ? allWeeklyMaxes[Math.floor(allWeeklyMaxes.length * 0.75)]
      : Infinity

  const sleepers: SleeperPick[] = []

  for (const pick of picks) {
    const p = politicians.get(pick.bioguideId)
    if (!p) continue

    // Must be bench or sleeper tier
    if (p.salaryTier !== 'bench' && p.salaryTier !== 'sleeper') continue

    const hasHighTradeVolume = p.tradeCount >= 10
    const weeklyMax = p.weeklyPoints && p.weeklyPoints.length > 0 ? Math.max(...p.weeklyPoints) : 0
    const hasHotStreak = weeklyMax >= top25pctThreshold

    if (!hasHighTradeVolume && !hasHotStreak) continue

    let reason: string
    if (hasHighTradeVolume && hasHotStreak) {
      reason = `High trade volume (${p.tradeCount} trades) and a top-25% weekly peak — serious upside at ${p.salaryTier} price`
    } else if (hasHighTradeVolume) {
      reason = `High trade volume at bench price — ${p.tradeCount} trades signals active portfolio management`
    } else {
      reason = `Recent hot streak (${weeklyMax.toFixed(1)} pts peak week) at ${p.salaryTier} price — potential breakout`
    }

    sleepers.push({
      pickNumber: pick.pickNumber,
      bioguideId: pick.bioguideId,
      teamIndex: pick.teamIndex,
      reason,
    })
  }

  return sleepers
}
