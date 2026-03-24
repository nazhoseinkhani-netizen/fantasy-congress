'use client'

import type { Politician } from '@/types'

interface TopTrade {
  politicianName: string
  points: number
  ticker: string
}

interface WeeklyRecapMockupProps {
  teamName: string
  weekNumber: number
  userScore: number
  opponentScore: number
  opponentName: string
  userRecord: string
  mvpPolitician: Politician | null
  topTrades: TopTrade[]
}

export function WeeklyRecapMockup({
  teamName,
  weekNumber,
  userScore,
  opponentScore,
  opponentName,
  userRecord,
  mvpPolitician,
  topTrades,
}: WeeklyRecapMockupProps) {
  const userWon = userScore > opponentScore

  return (
    <div
      style={{
        maxWidth: 600,
        margin: '0 auto',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        background: '#0f1729',
        color: '#e5e7eb',
        borderRadius: 12,
        overflow: 'hidden',
      }}
    >
      {/* Gold gradient header bar */}
      <div
        style={{
          height: 4,
          background: 'linear-gradient(90deg, #d4a843, #b8941f, #d4a843)',
        }}
      />

      {/* Logo area */}
      <div style={{ textAlign: 'center', padding: '24px 24px 0' }}>
        <div
          style={{
            fontSize: 14,
            letterSpacing: 4,
            color: '#d4a843',
            fontWeight: 700,
            textTransform: 'uppercase',
          }}
        >
          FANTASY CONGRESS
        </div>
        <div
          style={{
            fontSize: 10,
            color: '#6b7280',
            letterSpacing: 3,
            marginTop: 4,
            textTransform: 'uppercase',
          }}
        >
          WEEKLY RECAP
        </div>
        {/* Week badge */}
        <div style={{ marginTop: 12 }}>
          <span
            style={{
              display: 'inline-block',
              background: '#d4a84326',
              border: '1px solid #d4a84366',
              color: '#d4a843',
              fontSize: 11,
              fontWeight: 600,
              padding: '3px 12px',
              borderRadius: 999,
              letterSpacing: 1,
            }}
          >
            Week {weekNumber}
          </span>
        </div>
      </div>

      {/* Matchup section */}
      <div
        style={{
          background: '#1a1a2e',
          margin: 16,
          borderRadius: 8,
          padding: 20,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          {/* User team */}
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 4 }}>Your Team</div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: '#e5e7eb',
                marginBottom: 8,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {teamName}
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: userWon ? '#22c55e' : '#e5e7eb',
                lineHeight: 1,
              }}
            >
              {userScore.toFixed(1)}
            </div>
          </div>

          {/* VS divider */}
          <div style={{ textAlign: 'center', padding: '0 8px' }}>
            <div style={{ fontSize: 11, color: '#4b5563', fontWeight: 700 }}>VS</div>
            {/* Win/loss badge */}
            <div style={{ marginTop: 8 }}>
              <span
                style={{
                  display: 'inline-block',
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: userWon ? '#22c55e26' : '#ef444426',
                  border: `2px solid ${userWon ? '#22c55e' : '#ef4444'}`,
                  color: userWon ? '#22c55e' : '#ef4444',
                  fontSize: 13,
                  fontWeight: 800,
                  lineHeight: '24px',
                  textAlign: 'center',
                }}
              >
                {userWon ? 'W' : 'L'}
              </span>
            </div>
          </div>

          {/* Opponent */}
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 4 }}>Opponent</div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: '#e5e7eb',
                marginBottom: 8,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {opponentName}
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: !userWon ? '#22c55e' : '#e5e7eb',
                lineHeight: 1,
              }}
            >
              {opponentScore.toFixed(1)}
            </div>
          </div>
        </div>

        {/* Record */}
        <div
          style={{
            marginTop: 16,
            paddingTop: 12,
            borderTop: '1px solid #ffffff1a',
            textAlign: 'center',
            fontSize: 12,
            color: '#9ca3af',
          }}
        >
          Season Record:{' '}
          <span style={{ color: '#e5e7eb', fontWeight: 600 }}>{userRecord}</span>
        </div>
      </div>

      {/* MVP section */}
      {mvpPolitician && (
        <div style={{ margin: '0 16px 16px', padding: 16, background: '#1a1a2e', borderRadius: 8 }}>
          <div
            style={{
              fontSize: 10,
              color: '#d4a843',
              letterSpacing: 2,
              textTransform: 'uppercase',
              fontWeight: 700,
              marginBottom: 12,
              textAlign: 'center',
            }}
          >
            Week MVP
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid #d4a843',
                flexShrink: 0,
                background: '#374151',
              }}
            >
              <img
                src={mvpPolitician.photoUrl}
                alt={mvpPolitician.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#e5e7eb' }}>
                {mvpPolitician.name}
              </div>
              <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>
                {mvpPolitician.party} &middot; {mvpPolitician.state}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#d4a843' }}>
                {mvpPolitician.seasonPoints}
              </div>
              <div style={{ fontSize: 10, color: '#6b7280' }}>pts</div>
            </div>
          </div>
        </div>
      )}

      {/* Top trades section */}
      {topTrades.length > 0 && (
        <div style={{ margin: '0 16px 16px', padding: 16, background: '#1a1a2e', borderRadius: 8 }}>
          <div
            style={{
              fontSize: 10,
              color: '#d4a843',
              letterSpacing: 2,
              textTransform: 'uppercase',
              fontWeight: 700,
              marginBottom: 12,
            }}
          >
            Top Trades This Week
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {topTrades.map((trade, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#e5e7eb' }}>
                    {trade.politicianName}
                  </span>
                  <span
                    style={{
                      marginLeft: 8,
                      fontSize: 11,
                      color: '#6b7280',
                      background: '#374151',
                      padding: '1px 6px',
                      borderRadius: 4,
                    }}
                  >
                    {trade.ticker}
                  </span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#d4a843' }}>
                  +{trade.points.toFixed(1)} pts
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          borderTop: '1px solid #ffffff0d',
          padding: '16px 24px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 10, color: '#6b7280' }}>
          Powered by Alva —{' '}
          <a
            href="https://alva.ai"
            style={{ color: '#d4a843', textDecoration: 'none' }}
          >
            alva.ai
          </a>
        </div>
        <div style={{ marginTop: 6, fontSize: 10, color: '#374151' }}>
          <a href="#" style={{ color: '#374151', textDecoration: 'underline' }}>
            Manage preferences
          </a>
          {' · '}
          <a href="#" style={{ color: '#374151', textDecoration: 'underline' }}>
            Unsubscribe
          </a>
        </div>
      </div>
    </div>
  )
}
