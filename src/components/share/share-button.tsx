'use client'

import { Share2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ShareButtonProps {
  onClick: () => void
  generating?: boolean
  size?: 'sm' | 'md'
  className?: string
}

export function ShareButton({ onClick, generating = false, size = 'md', className }: ShareButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={generating}
      className={cn(
        'inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors disabled:opacity-50',
        size === 'sm' ? 'text-xs' : 'text-sm',
        className
      )}
    >
      {generating ? (
        <span
          className={cn(
            'border-2 border-current border-t-transparent rounded-full animate-spin',
            size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'
          )}
        />
      ) : (
        <Share2 className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      )}
      <span>Share</span>
    </button>
  )
}
