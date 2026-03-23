/**
 * Pure functions for snake draft order calculation.
 * Even rounds go 0,1,2,3. Odd rounds go 3,2,1,0 (snake).
 */

/**
 * Given a global pick number and team count, return which team picks.
 * Even rounds go 0,1,2,3. Odd rounds go 3,2,1,0 (snake).
 */
export function snakeDraftTeamIndex(pickNumber: number, teamCount: number): number {
  const round = Math.floor(pickNumber / teamCount)
  const posInRound = pickNumber % teamCount
  if (round % 2 === 0) {
    return posInRound
  } else {
    return teamCount - 1 - posInRound
  }
}

/**
 * Generate full draft order array: [teamIndex for pick 0, teamIndex for pick 1, ...]
 */
export function generateDraftOrder(teamCount: number, rounds: number): number[] {
  const totalPicks = teamCount * rounds
  const order: number[] = []
  for (let i = 0; i < totalPicks; i++) {
    order.push(snakeDraftTeamIndex(i, teamCount))
  }
  return order
}
