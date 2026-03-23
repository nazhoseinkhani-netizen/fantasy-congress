import { Users, TrendingUp, Trophy } from 'lucide-react'

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
    </section>
  )
}
