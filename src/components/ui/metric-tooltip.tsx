'use client'

import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

export const METRIC_EXPLANATIONS: Record<string, string> = {
  // Politician stats
  seasonPoints: 'Total fantasy points earned across all 6 weeks of the season',
  weeklyPoints: 'Fantasy points earned in a single week from all trades',
  winRate: 'Percentage of trades that beat the S&P 500 index return',
  avgReturn: 'Average percentage return across all trades',
  tradeCount: 'Total number of stock trades disclosed during the season',
  salaryCap: 'Fantasy salary cost to draft this politician onto your roster',
  salaryTier:
    'Salary bracket: Elite ($8k+), Starter ($5-8k), Mid-tier ($3-5k), Bench ($1.5-3k), Sleeper (<$1.5k)',

  // Risk/Corruption metrics
  insiderRiskScore:
    'Composite 0-100 score measuring insider trading risk based on 5 factors',
  donorOverlap:
    'Correlation between campaign donors and stocks traded — higher means more suspicious overlap',
  suspiciousTiming:
    'Trades made shortly before major market-moving announcements',
  committeeConflict:
    "Trades in sectors overseen by the politician's assigned committees",
  stockActCompliance:
    'Timeliness and completeness of STOCK Act trade disclosure filings',
  tradeVolume: 'Frequency and total dollar value of trading activity',

  // Trade metrics
  returnVsSP500:
    'How much the trade beat (or lagged) the S&P 500 over the same period',
  absoluteReturn:
    'Total percentage return on the trade from purchase to current/sale price',
  fantasyPoints:
    'Fantasy points for this trade — base points + bonuses - penalties, with multipliers',
  amountRange:
    'Disclosed dollar range of the trade (Congress members report ranges, not exact amounts)',
  daysToDisclose:
    'Days between the trade date and the public disclosure filing. STOCK Act requires 45 days.',

  // Bonus types
  bigMover: '+20 points — Trade with absolute return exceeding 20%',
  bipartisanBet:
    '+25 points — Trade in a sector with bipartisan legislative activity',
  donorDarling: '+10 points — Trade correlating with campaign donor interests',
  insiderTiming:
    '+15 points — Trade placed shortly before a significant announcement',
  activityBonus: '+5 points per trade — Awarded for high trading frequency',

  // Penalty types
  paperHands: '-15 points — Sold a position within 30 days of buying',
  lateDisclosure:
    '-10 points — Filed disclosure after the 45-day STOCK Act deadline',
  washSale: '-5 points — Buy and sell of same security within 30-day window',

  // Risk tiers
  'clean-record':
    'Score 0-14: No significant insider trading indicators detected',
  'minor-concerns': 'Score 15-34: Some trading patterns worth monitoring',
  'raised-eyebrows': 'Score 35-59: Multiple suspicious indicators present',
  'seriously-suspicious':
    'Score 60-84: Strong evidence of concerning trading patterns',
  'peak-swamp':
    'Score 85-100: Maximum insider trading risk — the swampiest of the swamp',
}

interface MetricTooltipProps {
  metric: string
  children: React.ReactNode
  className?: string
}

export function MetricTooltip({ metric, children, className }: MetricTooltipProps) {
  const explanation = METRIC_EXPLANATIONS[metric] || metric

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          className={cn(
            'border-b border-dashed border-muted-foreground/50 cursor-help',
            className
          )}
        >
          {children}
        </TooltipTrigger>
        <TooltipContent className="max-w-xs text-sm">
          {explanation}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
