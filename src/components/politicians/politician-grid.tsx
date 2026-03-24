'use client'

import Link from 'next/link'
import type { Politician } from '@/types'
import { PoliticianCard } from '@/components/design/politician-card'

interface PoliticianGridProps {
  politicians: Politician[]
  onPoliticianClick?: (bioguideId: string) => void
}

export function PoliticianGrid({ politicians, onPoliticianClick }: PoliticianGridProps) {
  if (politicians.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <p className="text-lg font-medium">No politicians match your filters</p>
        <p className="text-sm mt-1">Try adjusting your search or filter criteria</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {politicians.map((politician) => (
        <Link
          key={politician.bioguideId}
          href={`/politicians/${politician.bioguideId}`}
          className="block"
          onClick={() => onPoliticianClick?.(politician.bioguideId)}
        >
          <PoliticianCard politician={politician} variant="full" />
        </Link>
      ))}
    </div>
  )
}
