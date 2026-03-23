'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Activity,
  Trophy,
  Shield,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', label: 'Home', icon: LayoutDashboard },
  { href: '/politicians', label: 'Politicians', icon: Users },
  { href: '/feed', label: 'Feed', icon: Activity },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: '/team', label: 'Team', icon: Shield },
]

export function NavMobile() {
  const pathname = usePathname()

  return (
    <nav className="flex lg:hidden fixed bottom-0 left-0 right-0 z-50 h-16 border-t border-border bg-background/95 backdrop-blur-sm">
      <div className="flex w-full items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 px-3 py-2 min-w-0 flex-1 transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="size-5 shrink-0" />
              <span className="text-[10px] font-medium leading-none truncate">
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
