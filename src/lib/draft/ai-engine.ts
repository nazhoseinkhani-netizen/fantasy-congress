import type { Politician } from '@/types/politician'
import type { AIArchetype } from '@/types/draft'

/**
 * Score a politician for a given AI archetype.
 * Higher score = better pick for that archetype.
 */
export function scoreForArchetype(
  archetype: AIArchetype,
  politician: Politician,
  teamRoster: string[],
  allPoliticians: Map<string, Politician>
): number {
  const { seasonPoints, salaryCap, insiderRiskScore, party } = politician

  switch (archetype) {
    case 'value-hunter': {
      // Maximizes seasonPoints / salaryCap ratio
      const valueRatio = salaryCap > 0 ? (seasonPoints / salaryCap) * 10_000 : 0
      return seasonPoints * 0.4 + valueRatio * 0.6
    }

    case 'corruption-chaser': {
      // Prefers high insiderRiskScore
      return insiderRiskScore * 0.6 + seasonPoints * 0.4
    }

    case 'party-loyalist': {
      // First 2 picks determine party preference; +30% bonus to same party after that
      const rosterPoliticians = teamRoster
        .map((id) => allPoliticians.get(id))
        .filter((p): p is Politician => p !== undefined)

      let preferredParty: string | null = null
      if (rosterPoliticians.length >= 2) {
        // Determine dominant party from existing roster
        const partyCounts: Record<string, number> = {}
        for (const p of rosterPoliticians) {
          partyCounts[p.party] = (partyCounts[p.party] ?? 0) + 1
        }
        let maxCount = 0
        for (const [p, count] of Object.entries(partyCounts)) {
          if (count > maxCount) {
            maxCount = count
            preferredParty = p
          }
        }
      }

      const sameParty = preferredParty !== null && party === preferredParty
      const baseScore = seasonPoints * 0.7
      const partyBonus = sameParty ? seasonPoints * 0.3 : 0
      return baseScore + partyBonus
    }

    case 'balanced': {
      // Equal weight to points and value
      const valueRatio = salaryCap > 0 ? (seasonPoints / salaryCap) * 10_000 : 0
      return seasonPoints * 0.5 + valueRatio * 0.3 + insiderRiskScore * 0.2
    }

    default: {
      const _exhaustive: never = archetype
      return 0
    }
  }
}

/**
 * Select the best available pick for an AI team.
 * Filters to affordable politicians, scores each, applies 15% mistake rate.
 */
export function selectAIPick(
  archetype: AIArchetype,
  availableIds: string[],
  teamRoster: string[],
  salaryRemaining: number,
  politicians: Map<string, Politician>
): string {
  // Filter to affordable politicians
  const affordable = availableIds.filter((id) => {
    const p = politicians.get(id)
    return p !== undefined && p.salaryCap <= salaryRemaining
  })

  // If no affordable options, return cheapest available politician
  if (affordable.length === 0) {
    let cheapestId = availableIds[0]
    let cheapestSalary = Infinity
    for (const id of availableIds) {
      const p = politicians.get(id)
      if (p && p.salaryCap < cheapestSalary) {
        cheapestSalary = p.salaryCap
        cheapestId = id
      }
    }
    return cheapestId
  }

  // Score each affordable politician
  const scored = affordable.map((id) => {
    const p = politicians.get(id)!
    return { id, score: scoreForArchetype(archetype, p, teamRoster, politicians) }
  })

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score)

  // Apply mistake logic
  const rand = Math.random()
  if (scored.length >= 3 && rand < 0.10) {
    // Pick #2 (index 1)
    return scored[1].id
  } else if (scored.length >= 3 && rand < 0.15) {
    // Pick #3 (index 2)
    return scored[2].id
  } else {
    // Pick #1 (best pick)
    return scored[0].id
  }
}
