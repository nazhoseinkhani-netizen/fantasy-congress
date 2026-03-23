import { cn } from '@/lib/utils'

interface StatCellProps {
  label: string
  value: string | number
  trend?: 'up' | 'down' | 'neutral'
  format?: 'number' | 'percent' | 'currency' | 'points'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

function formatValue(value: string | number, format?: StatCellProps['format']): string {
  if (typeof value === 'string') return value
  switch (format) {
    case 'currency':
      return `$${value.toLocaleString()}`
    case 'percent':
      return `${value}%`
    case 'points':
      return `${value} pts`
    default:
      return String(value)
  }
}

const sizeClasses = {
  sm: { label: 'text-xs', value: 'text-sm' },
  md: { label: 'text-xs', value: 'text-base' },
  lg: { label: 'text-sm', value: 'text-xl' },
}

export function StatCell({
  label,
  value,
  trend = 'neutral',
  format,
  size = 'md',
  className,
}: StatCellProps) {
  const classes = sizeClasses[size]
  const formatted = formatValue(value, format)

  return (
    <div className={cn('flex flex-col gap-0.5', className)}>
      <span className={cn('text-muted-foreground font-medium uppercase tracking-wide', classes.label)}>
        {label}
      </span>
      <div className="flex items-center gap-1">
        <span className={cn('font-bold tabular-nums leading-none', classes.value)}>
          {formatted}
        </span>
        {trend === 'up' && (
          <svg
            className="size-3.5 text-emerald-500 shrink-0"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 9V3M3 6l3-3 3 3" />
          </svg>
        )}
        {trend === 'down' && (
          <svg
            className="size-3.5 text-red-500 shrink-0"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 3v6M3 6l3 3 3-3" />
          </svg>
        )}
        {trend === 'neutral' && (
          <svg
            className="size-3.5 text-muted-foreground shrink-0"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M2 6h8" />
          </svg>
        )}
      </div>
    </div>
  )
}
