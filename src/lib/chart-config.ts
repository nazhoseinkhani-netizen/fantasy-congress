// Shared Recharts dark theme configuration
// Used by: profile charts (LineChart, PieChart, AreaChart, RadarChart), any future charts

export const CHART_COLORS = {
  primary: 'var(--color-primary)',      // gold accent
  dem: 'var(--color-party-dem)',
  rep: 'var(--color-party-rep)',
  ind: 'var(--color-party-ind)',
  positive: 'oklch(0.65 0.18 145)',     // green for gains
  negative: 'oklch(0.6 0.23 25)',       // red for losses
  muted: 'var(--color-muted-foreground)',
  border: 'var(--color-border)',
  card: 'var(--color-card)',
  foreground: 'var(--color-foreground)',
}

export const CHART_TOOLTIP_STYLE = {
  backgroundColor: 'var(--color-card)',
  border: '1px solid var(--color-border)',
  borderRadius: '6px',
  color: 'var(--color-foreground)',
}

export const CHART_AXIS_STYLE = {
  stroke: 'var(--color-muted-foreground)',
  tick: { fill: 'var(--color-muted-foreground)', fontSize: 11 },
  axisLine: false as const,
  tickLine: false as const,
}

// Sector colors for pie charts
export const SECTOR_COLORS = [
  'var(--color-primary)',
  'var(--color-party-dem)',
  'var(--color-party-rep)',
  'oklch(0.65 0.18 145)',
  'oklch(0.7 0.15 200)',
  'oklch(0.6 0.2 300)',
  'oklch(0.55 0.15 50)',
  'oklch(0.65 0.12 170)',
]
