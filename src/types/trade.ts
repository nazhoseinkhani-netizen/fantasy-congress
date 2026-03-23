import type { Party, Chamber } from './politician'

export type TradeType = 'buy' | 'sell'

export type AmountRange =
  | '$1k-$15k'
  | '$15k-$50k'
  | '$50k-$100k'
  | '$100k-$250k'
  | '$250k-$500k'
  | '$500k-$1M'
  | '$1M+'

export interface Trade {
  id: string
  bioguideId: string
  politicianName: string
  party: Party
  chamber: Chamber
  ticker: string
  company: string
  sector: string
  tradeType: TradeType
  disclosureDate: string     // ISO 8601 date string
  tradeDate: string          // ISO 8601 date string
  amountRange: AmountRange
  returnVsSP500: number      // % return minus S&P return over same period
  absoluteReturn: number     // % absolute return
  sp500Return: number        // % S&P 500 return over same period
  daysToDisclose: number     // Days between trade and disclosure
  fantasyPoints: number      // Pre-computed total fantasy points
  scoreBreakdown: TradeScoreBreakdown
}

export interface TradeScoreBreakdown {
  basePoints: number
  excessReturnPoints: number
  amountMultiplier: number
  bonuses: { type: string; points: number }[]
  penalties: { type: string; points: number }[]
  positionMultiplier: number   // Committee chair / leadership
  totalBeforeMultiplier: number
  total: number
}
