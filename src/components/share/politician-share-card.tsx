'use client'

import { forwardRef } from 'react'
import type { Politician, InsiderRiskTier } from '@/types/politician'

const TIER_COLORS: Record<InsiderRiskTier, string> = {
  'clean-record': '#4AAF6E',
  'minor-concerns': '#B8A846',
  'raised-eyebrows': '#C9944A',
  'seriously-suspicious': '#D46A3A',
  'peak-swamp': '#D94A4A',
}

const TIER_LABELS: Record<InsiderRiskTier, string> = {
  'clean-record': 'CLEAN RECORD',
  'minor-concerns': 'MINOR CONCERNS',
  'raised-eyebrows': 'RAISED EYEBROWS',
  'seriously-suspicious': 'SERIOUSLY SUSPICIOUS',
  'peak-swamp': 'PEAK SWAMP',
}

const PARTY_COLORS: Record<string, string> = {
  D: '#3B82F6',
  R: '#EF4444',
  I: '#8B5CF6',
}

interface PoliticianShareCardProps {
  politician: Politician
}

export const PoliticianShareCard = forwardRef<HTMLDivElement, PoliticianShareCardProps>(
  ({ politician }, ref) => {
    const tierColor = TIER_COLORS[politician.insiderRiskTier]
    const partyColor = PARTY_COLORS[politician.party] ?? PARTY_COLORS['I']
    const chamberLabel = politician.chamber === 'senate' ? 'Senator' : 'Representative'

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
            marginBottom: '14px',
          }}
        >
          FANTASY CONGRESS
        </div>

        {/* Politician photo */}
        <img
          src={politician.photoUrl}
          alt={politician.name}
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '3px solid #d4a843',
            margin: '0 auto 12px auto',
            display: 'block',
          }}
        />

        {/* Name */}
        <div
          style={{
            fontSize: '20px',
            fontWeight: 700,
            textAlign: 'center',
            marginBottom: '4px',
            lineHeight: 1.2,
          }}
        >
          {politician.name}
        </div>

        {/* Party / Chamber / State */}
        <div
          style={{
            fontSize: '11px',
            textAlign: 'center',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          <span style={{ color: partyColor, fontWeight: 700 }}>{politician.party}</span>
          <span style={{ color: '#6b7280' }}>•</span>
          <span style={{ color: '#9ca3af' }}>{chamberLabel}</span>
          <span style={{ color: '#6b7280' }}>•</span>
          <span style={{ color: '#9ca3af' }}>{politician.state}</span>
        </div>

        {/* Stats grid 2x2 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            marginBottom: '12px',
          }}
        >
          {/* Season Points */}
          <div
            style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '8px',
              padding: '8px 12px',
            }}
          >
            <div
              style={{
                fontSize: '9px',
                color: '#9ca3af',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '4px',
              }}
            >
              Season Points
            </div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#d4a843' }}>
              {politician.seasonPoints}
            </div>
          </div>

          {/* Insider Risk Score */}
          <div
            style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '8px',
              padding: '8px 12px',
            }}
          >
            <div
              style={{
                fontSize: '9px',
                color: '#9ca3af',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '4px',
              }}
            >
              Risk Score
            </div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: tierColor }}>
              {politician.insiderRiskScore}
            </div>
          </div>

          {/* Trade Count */}
          <div
            style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '8px',
              padding: '8px 12px',
            }}
          >
            <div
              style={{
                fontSize: '9px',
                color: '#9ca3af',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '4px',
              }}
            >
              Trade Count
            </div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#d4a843' }}>
              {politician.tradeCount}
            </div>
          </div>

          {/* Win Rate */}
          <div
            style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '8px',
              padding: '8px 12px',
            }}
          >
            <div
              style={{
                fontSize: '9px',
                color: '#9ca3af',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '4px',
              }}
            >
              Win Rate
            </div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#d4a843' }}>
              {Math.round(politician.winRate * 100)}%
            </div>
          </div>
        </div>

        {/* Insider Risk Tier badge */}
        <div
          style={{
            textAlign: 'center',
            padding: '8px 0',
            marginBottom: '12px',
          }}
        >
          <div
            style={{
              display: 'inline-block',
              background: `${tierColor}26`,
              border: `1px solid ${tierColor}66`,
              borderRadius: '20px',
              padding: '4px 16px',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '1.5px',
              color: tierColor,
              textTransform: 'uppercase',
            }}
          >
            {TIER_LABELS[politician.insiderRiskTier]}
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

PoliticianShareCard.displayName = 'PoliticianShareCard'
