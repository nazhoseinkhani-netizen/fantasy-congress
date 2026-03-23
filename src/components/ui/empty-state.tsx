import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  icon?: React.ReactNode
  heading: string
  description: string
  action?: { label: string; onClick: () => void }
  className?: string
}

export function EmptyState({
  icon,
  heading,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 text-center',
        className
      )}
    >
      {icon && (
        <div className="mb-4 text-muted-foreground/50 [&>svg]:size-12">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-muted-foreground">{heading}</h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground/70">
        {description}
      </p>
      {action && (
        <Button
          variant="outline"
          className="mt-4"
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </div>
  )
}
