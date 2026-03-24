'use client'

import { usePathname } from 'next/navigation'
import { NavDesktop } from './nav-desktop'
import { NavMobile } from './nav-mobile'
import { AlvaFooter } from '@/components/landing/alva-footer'

interface RootLayoutProps {
  children: React.ReactNode
}

export function RootLayout({ children }: RootLayoutProps) {
  const pathname = usePathname()
  const isDraftActive = pathname === '/draft'

  return (
    <>
      <NavDesktop />
      <main className="min-h-screen pt-0 pb-20 lg:pt-16 lg:pb-0">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      {!isDraftActive && <AlvaFooter variant="compact" />}
      <NavMobile />
    </>
  )
}
