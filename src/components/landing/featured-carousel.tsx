'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { PoliticianCard } from '@/components/design/politician-card'
import { Skeleton } from '@/components/ui/skeleton'
import { loadPoliticians } from '@/lib/data'
import type { Politician } from '@/types'

export function FeaturedCarousel() {
  const [politicians, setPoliticians] = useState<Politician[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    loadPoliticians()
      .then((all) => {
        // Sort by seasonPoints desc, take top 5
        const top5 = [...all]
          .sort((a, b) => b.seasonPoints - a.seasonPoints)
          .slice(0, 5)
        setPoliticians(top5)
        setLoading(false)
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load politicians')
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (politicians.length === 0) return

    intervalRef.current = setInterval(() => {
      if (!isHovered) {
        setCurrentIndex((prev) => (prev + 1) % politicians.length)
      }
    }, 4000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [politicians.length, isHovered])

  if (error) {
    return (
      <section className="mx-auto max-w-5xl px-4">
        <h2 className="mb-8 text-center text-3xl font-bold tracking-tight md:text-4xl">
          Top Congressional Traders
        </h2>
        <p className="text-center text-muted-foreground">Failed to load politician data.</p>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-5xl px-4">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Top Congressional Traders</h2>
        <p className="mt-3 text-muted-foreground">
          The most active stock traders in Congress — draft them before your opponents do.
        </p>
      </div>

      <div className="flex flex-col items-center gap-6">
        {/* Card container */}
        <div
          className="w-full max-w-md"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {loading ? (
            <div className="space-y-3 rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="size-14 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <Skeleton className="h-10 w-16" />
              </div>
            </div>
          ) : politicians.length > 0 ? (
            <Link
              href={`/politicians/${politicians[currentIndex].bioguideId}`}
              className="block"
            >
              <PoliticianCard
                politician={politicians[currentIndex]}
                variant="compact"
              />
            </Link>
          ) : null}
        </div>

        {/* Dot indicators */}
        {!loading && politicians.length > 0 && (
          <div className="flex items-center gap-2">
            {politicians.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to politician ${idx + 1}`}
                className={`h-2 rounded-full transition-all ${
                  idx === currentIndex
                    ? 'w-6 bg-primary'
                    : 'w-2 bg-muted hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
