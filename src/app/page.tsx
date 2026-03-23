import { PoliticianCard } from '@/components/design/politician-card'
import type { Politician } from '@/types'

const mockPoliticians: Politician[] = [
  {
    bioguideId: 'P000197',
    name: 'Nancy Pelosi',
    firstName: 'Nancy',
    lastName: 'Pelosi',
    party: 'D',
    chamber: 'house',
    state: 'CA',
    district: '11',
    committees: ['House Democratic Caucus'],
    photoUrl: 'https://bioguide.congress.gov/bioguide/photo/P/P000197.jpg',
    isCommitteeChair: false,
    isLeadership: true,
    seasonPoints: 1842,
    weeklyPoints: [280, 310, 295, 340, 290, 327],
    tradeCount: 63,
    winRate: 0.78,
    avgReturn: 14.2,
    insiderRiskScore: 87,
    insiderRiskTier: 'peak-swamp',
    insiderRiskBreakdown: {
      donorOverlap: 85,
      suspiciousTiming: 92,
      committeeConflict: 88,
      stockActCompliance: 15,
      tradeVolume: 95,
    },
    salaryCap: 9800,
    salaryTier: 'elite',
  },
  {
    bioguideId: 'T000250',
    name: 'Tommy Tuberville',
    firstName: 'Tommy',
    lastName: 'Tuberville',
    party: 'R',
    chamber: 'senate',
    state: 'AL',
    committees: ['Armed Services', 'Agriculture'],
    photoUrl: 'https://bioguide.congress.gov/bioguide/photo/T/T000250.jpg',
    isCommitteeChair: false,
    isLeadership: false,
    seasonPoints: 724,
    weeklyPoints: [120, 95, 140, 110, 130, 129],
    tradeCount: 28,
    winRate: 0.61,
    avgReturn: 7.8,
    insiderRiskScore: 62,
    insiderRiskTier: 'seriously-suspicious',
    insiderRiskBreakdown: {
      donorOverlap: 55,
      suspiciousTiming: 71,
      committeeConflict: 65,
      stockActCompliance: 40,
      tradeVolume: 70,
    },
    salaryCap: 5400,
    salaryTier: 'starter',
  },
  {
    bioguideId: 'S001185',
    name: 'Terri Sewell',
    firstName: 'Terri',
    lastName: 'Sewell',
    party: 'D',
    chamber: 'house',
    state: 'AL',
    district: '7',
    committees: ['Ways and Means', 'Financial Services'],
    photoUrl: 'https://bioguide.congress.gov/bioguide/photo/S/S001185.jpg',
    isCommitteeChair: false,
    isLeadership: false,
    seasonPoints: 312,
    weeklyPoints: [55, 48, 60, 52, 50, 47],
    tradeCount: 8,
    winRate: 0.5,
    avgReturn: 3.1,
    insiderRiskScore: 22,
    insiderRiskTier: 'minor-concerns',
    insiderRiskBreakdown: {
      donorOverlap: 20,
      suspiciousTiming: 18,
      committeeConflict: 25,
      stockActCompliance: 78,
      tradeVolume: 15,
    },
    salaryCap: 3200,
    salaryTier: 'mid-tier',
  },
]

export default function Home() {
  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Fantasy Congress</h1>
        <p className="mt-2 text-muted-foreground">Draft politicians. Score their trades. Win your league.</p>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-1">Design System Preview</h2>
        <p className="text-sm text-muted-foreground mb-4">PoliticianCard, RiskBadge, and StatCell components rendered with mock data.</p>

        {/* Full variant cards */}
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Full Variant</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {mockPoliticians.map((p) => (
            <PoliticianCard key={p.bioguideId} politician={p} variant="full" />
          ))}
        </div>

        {/* Compact variant */}
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Compact Variant</h3>
        <div className="flex flex-col gap-2 mb-8 max-w-lg">
          {mockPoliticians.map((p) => (
            <PoliticianCard key={p.bioguideId} politician={p} variant="compact" />
          ))}
        </div>

        {/* Mini variant */}
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Mini Variant</h3>
        <div className="flex flex-col max-w-xs border border-border rounded-xl overflow-hidden bg-card">
          {mockPoliticians.map((p) => (
            <PoliticianCard key={p.bioguideId} politician={p} variant="mini" />
          ))}
        </div>
      </div>
    </div>
  )
}
