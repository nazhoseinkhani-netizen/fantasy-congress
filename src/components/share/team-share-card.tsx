'use client'

import { forwardRef } from 'react'
import type { Politician } from '@/types/politician'

interface TeamShareCardProps {
  teamName: string
  record: string
  leagueRank: number
  roster: Politician[]
  totalPoints: number
}

export const TeamShareCard = forwardRef<HTMLDivElement, TeamShareCardProps>(
  ({ teamName, record, leagueRank, roster, totalPoints }, ref) => {
    const displayRoster = roster.slice(0, 8)

    const rankSuffix = leagueRank === 1 ? 'st' : leagueRank === 2 ? 'nd' : leagueRank === 3 ? 'rd' : 'th'

    // Split into two columns of 4
    const leftColumn = displayRoster.slice(0, 4)
    const rightColumn = displayRoster.slice(4, 8)

    return (
      <div
        ref={ref}
        style={{
          position: 'absolute',
          left: '-9999px',
          top: '-9999px',
          width: '400px',
          height: '560px',
          background: 'linear-gradient(180deg, #0f1729 0%, #1a1a2e 50%, #0f1729 100%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          color: 'white',
          padding: '24px',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        {/* Top gold line */}
        <div
          style={{
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #d4a843, transparent)',
            marginBottom: '14px',
          }}
        />

        {/* FANTASY CONGRESS header */}
        <div
          style={{
            fontSize: '10px',
            letterSpacing: '4px',
            color: '#d4a843',
            textTransform: 'uppercase',
            textAlign: 'center',
            marginBottom: '4px',
          }}
        >
          FANTASY CONGRESS
        </div>

        {/* MY TEAM subheader */}
        <div
          style={{
            fontSize: '9px',
            letterSpacing: '3px',
            color: '#6b7280',
            textTransform: 'uppercase',
            textAlign: 'center',
            marginBottom: '14px',
          }}
        >
          MY TEAM
        </div>

        {/* Team name */}
        <div
          style={{
            fontSize: '22px',
            fontWeight: 700,
            textAlign: 'center',
            marginBottom: '8px',
            lineHeight: 1.2,
          }}
        >
          {teamName}
        </div>

        {/* Record + Rank row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            marginBottom: '16px',
          }}
        >
          <div
            style={{
              background: 'rgba(212,168,67,0.15)',
              border: '1px solid rgba(212,168,67,0.4)',
              borderRadius: '6px',
              padding: '4px 12px',
              fontSize: '12px',
              fontWeight: 700,
              color: '#d4a843',
            }}
          >
            {record}
          </div>
          <div
            style={{
              fontSize: '11px',
              color: '#9ca3af',
            }}
          >
            {leagueRank}{rankSuffix} in League
          </div>
        </div>

        {/* Roster section label */}
        <div
          style={{
            fontSize: '9px',
            letterSpacing: '2px',
            color: '#6b7280',
            textTransform: 'uppercase',
            marginBottom: '8px',
          }}
        >
          Active Roster
        </div>

        {/* Roster 2-column grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4px',
            marginBottom: '14px',
          }}
        >
          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {leftColumn.map((p) => (
              <div
                key={p.bioguideId}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '6px',
                  padding: '5px 8px',
                }}
              >
                <img
                  src={p.photoUrl}
                  alt={p.name}
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '10px',
                      fontWeight: 600,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {p.lastName}
                  </div>
                  <div style={{ fontSize: '9px', color: '#9ca3af' }}>
                    {p.seasonPoints} pts
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {rightColumn.map((p) => (
              <div
                key={p.bioguideId}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '6px',
                  padding: '5px 8px',
                }}
              >
                <img
                  src={p.photoUrl}
                  alt={p.name}
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '10px',
                      fontWeight: 600,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {p.lastName}
                  </div>
                  <div style={{ fontSize: '9px', color: '#9ca3af' }}>
                    {p.seasonPoints} pts
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total points */}
        <div
          style={{
            textAlign: 'center',
            background: 'rgba(212,168,67,0.1)',
            borderRadius: '8px',
            padding: '8px',
            marginBottom: '14px',
          }}
        >
          <div
            style={{
              fontSize: '9px',
              color: '#9ca3af',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '2px',
            }}
          >
            Total Season Points
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#d4a843' }}>
            {totalPoints.toLocaleString()}
          </div>
        </div>

        {/* Bottom gold line */}
        <div
          style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, #d4a843, transparent)',
            marginBottom: '10px',
          }}
        />

        {/* Powered by Alva */}
        <div
          style={{
            fontSize: '10px',
            color: '#6b7280',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            textAlign: 'center',
          }}
        >
          Powered by Alva
        </div>
      </div>
    )
  }
)

TeamShareCard.displayName = 'TeamShareCard'
