'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/politicians', label: 'Politicians' },
  { href: '/feed', label: 'Trade Feed' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/team', label: 'My Team' },
  { href: '/league', label: 'League' },
]

export function NavDesktop() {
  const pathname = usePathname()

  return (
    <header className="hidden lg:flex fixed top-0 left-0 right-0 z-50 h-16 items-center border-b border-border bg-background/95 backdrop-blur-sm px-6">
      {/* Logo */}
      <div className="flex items-center gap-8 flex-1">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-widest text-primary uppercase">
            Fantasy Congress
          </span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-primary" />
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* User area */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">Demo User</span>
        <Avatar>
          <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
            FC
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
