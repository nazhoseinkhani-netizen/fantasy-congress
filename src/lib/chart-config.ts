// Shared Recharts dark theme configuration
// Used by: profile charts (LineChart, PieChart, AreaChart, RadarChart), any future charts
// NOTE: Recharts renders SVG — CSS var() may not resolve in all browsers for SVG attributes.
// Use hardcoded oklch values for SVG stroke/fill. CSS vars are OK for tooltip contentStyle (HTML).

export const CHART_COLORS = {
  primary: 'oklch(0.78 0.165 85)',           // gold accent
  dem: 'oklch(0.7 0.2 260)',                 // blue
  rep: 'oklch(0.7 0.22 25)',                 // red
  ind: 'oklch(0.7 0.15 145)',               // green
  positive: 'oklch(0.65 0.18 145)',          // green for gains
  negative: 'oklch(0.6 0.23 25)',            // red for losses
  muted: 'oklch(0.62 0.01 265)',             // muted foreground
  border: 'oklch(0.22 0.008 265)',           // border
  card: 'oklch(0.115 0.008 265)',            // card bg
  foreground: 'oklch(0.97 0 0)',             // foreground text
}

export const CHART_TOOLTIP_STYLE = {
  backgroundColor: 'var(--color-card)',
  border: '1px solid var(--color-border)',
  borderRadius: '6px',
  color: 'var(--color-foreground)',
}

export const CHART_AXIS_STYLE = {
  stroke: 'oklch(0.62 0.01 265)',
  tick: { fill: 'oklch(0.62 0.01 265)', fontSize: 11 },
  axisLine: false as const,
  tickLine: false as const,
}

// Sector colors for pie charts
export const SECTOR_COLORS = [
  'oklch(0.78 0.165 85)',    // gold
  'oklch(0.7 0.2 260)',      // blue
  'oklch(0.7 0.22 25)',      // red
  'oklch(0.65 0.18 145)',    // green
  'oklch(0.7 0.15 200)',     // teal
  'oklch(0.6 0.2 300)',      // purple
  'oklch(0.55 0.15 50)',     // orange
  'oklch(0.65 0.12 170)',    // cyan
]
