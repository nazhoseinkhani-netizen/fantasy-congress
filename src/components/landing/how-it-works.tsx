import { Users, TrendingUp, Trophy, Zap, AlertTriangle, Award } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: Users,
    title: 'Draft Your Team',
    description:
      'Pick 8 active politicians and 4 bench slots from Congress\'s most active stock traders. Build a roster that maximizes fantasy points.',
  },
  {
    number: '02',
    icon: TrendingUp,
    title: 'Score Their Trades',
    description:
      'Every Congressional stock trade earns fantasy points. Beat the S&P 500, get bonuses. Insider timing? Big multipliers. Late disclosures? Penalties.',
  },
  {
    number: '03',
    icon: Trophy,
    title: 'Win Your League',
    description:
      'Compete head-to-head in weekly matchups. Climb the Hall of Shame leaderboard. Expose who\'s really profiting from public office.',
  },
]

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-5xl px-4">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">How It Works</h2>
        <p className="mt-3 text-muted-foreground">
          Three simple steps to turn political corruption into fantasy gold.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {steps.map((step) => {
          const Icon = step.icon
          return (
            <div
              key={step.number}
              className="relative rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg"
            >
              {/* Step number */}
              <span className="block text-5xl font-black text-primary/20 leading-none mb-4">
                {step.number}
              </span>

              {/* Icon */}
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-5" />
              </div>

              {/* Content */}
              <h3 className="mb-2 text-lg font-bold">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          )
        })}
      </div>

      {/* Scoring Breakdown */}
      <div className="mt-16 rounded-xl border border-border bg-card p-8">
        <h3 className="text-2xl font-bold text-center mb-2">How Points Are Calculated</h3>
        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto text-sm">
          Every Congressional stock trade is scored based on real financial performance.
          Your team&apos;s total points compete head-to-head each week — just like fantasy football.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Base Points */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-5 text-primary" />
              <h4 className="font-bold">Base Points</h4>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex justify-between">
                <span>Trade beats S&P 500</span>
                <span className="font-mono text-green-400">+10 to +40</span>
              </li>
              <li className="flex justify-between">
                <span>Trade lags S&P 500</span>
                <span className="font-mono text-red-400">+1 to +5</span>
              </li>
              <li className="flex justify-between">
                <span>Per trade activity</span>
                <span className="font-mono text-green-400">+5 each</span>
              </li>
            </ul>
          </div>

          {/* Bonuses */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Award className="size-5 text-yellow-400" />
              <h4 className="font-bold">Bonuses</h4>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex justify-between">
                <span>Big Mover (&gt;20% return)</span>
                <span className="font-mono text-yellow-400">+20</span>
              </li>
              <li className="flex justify-between">
                <span>Bipartisan Bet</span>
                <span className="font-mono text-yellow-400">+25</span>
              </li>
              <li className="flex justify-between">
                <span>Insider Timing</span>
                <span className="font-mono text-yellow-400">+15</span>
              </li>
              <li className="flex justify-between">
                <span>Donor Darling</span>
                <span className="font-mono text-yellow-400">+10</span>
              </li>
            </ul>
          </div>

          {/* Penalties */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-red-400" />
              <h4 className="font-bold">Penalties</h4>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex justify-between">
                <span>Paper Hands (&lt;30 days)</span>
                <span className="font-mono text-red-400">-15</span>
              </li>
              <li className="flex justify-between">
                <span>Late Disclosure</span>
                <span className="font-mono text-red-400">-10</span>
              </li>
              <li className="flex justify-between">
                <span>Wash Sale</span>
                <span className="font-mono text-red-400">-5</span>
              </li>
            </ul>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6 border-t border-border pt-4">
          Weekly matchups: Your roster&apos;s total points vs your opponent&apos;s — highest score wins.
          Season standings determine league champions.
        </p>
      </div>
    </section>
  )
}
