'use client'

import Link from 'next/link'
import type { Politician } from '@/types'
import { RiskBadge } from '@/components/design/risk-badge'
import { PARTY_COLORS } from '@/lib/party-colors'
import type { SortField, SortDir } from './filter-sidebar'

interface SortableHeaderProps {
  label: string
  field: SortField
  currentSort: SortField
  currentDir: SortDir
  onSort: (field: SortField) => void
}

function SortableHeader({ label, field, currentSort, currentDir, onSort }: SortableHeaderProps) {
  const isActive = currentSort === field
  return (
    <th
      className="px-3 py-2 text-left text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground select-none whitespace-nowrap"
      onClick={() => onSort(field)}
    >
      <span className="flex items-center gap-1">
        {label}
        {isActive && (
          <span className="text-primary">{currentDir === 'desc' ? '↓' : '↑'}</span>
        )}
        {!isActive && <span className="opacity-30">↕</span>}
      </span>
    </th>
  )
}

interface PoliticianListTableProps {
  politicians: Politician[]
  sortBy?: SortField
  sortDir?: SortDir
  onSort?: (field: SortField) => void
}

export function PoliticianListTable({
  politicians,
  sortBy = 'seasonPoints',
  sortDir = 'desc',
  onSort,
}: PoliticianListTableProps) {
  if (politicians.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <p className="text-lg font-medium">No politicians match your filters</p>
        <p className="text-sm mt-1">Try adjusting your search or filter criteria</p>
      </div>
    )
  }

  function handleSort(field: SortField) {
    onSort?.(field)
  }

  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 border-b border-border">
          <tr>
            <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground w-10">
              Photo
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
              Name
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
              Party
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
              State
            </th>
            <SortableHeader
              label="Season Pts"
              field="seasonPoints"
              currentSort={sortBy}
              currentDir={sortDir}
              onSort={handleSort}
            />
            <SortableHeader
              label="Win Rate"
              field="winRate"
              currentSort={sortBy}
              currentDir={sortDir}
              onSort={handleSort}
            />
            <SortableHeader
              label="Avg Return"
              field="avgReturn"
              currentSort={sortBy}
              currentDir={sortDir}
              onSort={handleSort}
            />
            <SortableHeader
              label="Trades"
              field="tradeCount"
              currentSort={sortBy}
              currentDir={sortDir}
              onSort={handleSort}
            />
            <SortableHeader
              label="Risk"
              field="insiderRiskScore"
              currentSort={sortBy}
              currentDir={sortDir}
              onSort={handleSort}
            />
            <SortableHeader
              label="Salary"
              field="salaryCap"
              currentSort={sortBy}
              currentDir={sortDir}
              onSort={handleSort}
            />
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {politicians.map((politician) => {
            const partyColor = PARTY_COLORS[politician.party] ?? PARTY_COLORS['I']
            const partyLabel = politician.party
            return (
              <tr key={politician.bioguideId} className="hover:bg-muted/50 transition-colors">
                <td className="px-3 py-2">
                  <Link href={`/politicians/${politician.bioguideId}`} className="block">
                    <img
                      src={politician.photoUrl}
                      alt={politician.name}
                      loading="lazy"
                      className="size-8 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                      }}
                    />
                  </Link>
                </td>
                <td className="px-3 py-2 font-medium">
                  <Link
                    href={`/politicians/${politician.bioguideId}`}
                    className="hover:text-primary transition-colors"
                  >
                    {politician.name}
                  </Link>
                </td>
                <td className="px-3 py-2">
                  <span
                    className="inline-flex items-center px-1.5 py-0.5 text-xs font-semibold rounded"
                    style={{
                      color: partyColor,
                      backgroundColor: `${partyColor}26`,
                    }}
                  >
                    {partyLabel}
                  </span>
                </td>
                <td className="px-3 py-2 text-muted-foreground">{politician.state}</td>
                <td className="px-3 py-2 font-mono text-right">{politician.seasonPoints}</td>
                <td className="px-3 py-2 font-mono text-right">
                  {Math.round(politician.winRate * 100)}%
                </td>
                <td className="px-3 py-2 font-mono text-right">
                  {politician.avgReturn > 0 ? '+' : ''}
                  {politician.avgReturn.toFixed(1)}%
                </td>
                <td className="px-3 py-2 font-mono text-right">{politician.tradeCount}</td>
                <td className="px-3 py-2">
                  <RiskBadge
                    tier={politician.insiderRiskTier}
                    score={politician.insiderRiskScore}
                    size="sm"
                  />
                </td>
                <td className="px-3 py-2 font-mono text-right">
                  ${politician.salaryCap.toLocaleString()}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
