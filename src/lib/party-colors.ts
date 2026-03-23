// Direct hex colors for party affiliation — used everywhere D/R/I appears
// These are NOT CSS variables because inline style={} with var() can fail
// to resolve in some rendering contexts (SSG, SVG, hydration edge cases).

export const PARTY_COLORS: Record<string, string> = {
  D: '#4A90D9',  // Democrat blue
  R: '#D94A4A',  // Republican red
  I: '#4AAF6E',  // Independent green
}

export const PARTY_LABELS: Record<string, string> = {
  D: 'D',
  R: 'R',
  I: 'I',
}

export const PARTY_FULL_LABELS: Record<string, string> = {
  D: 'Democrat',
  R: 'Republican',
  I: 'Independent',
}
