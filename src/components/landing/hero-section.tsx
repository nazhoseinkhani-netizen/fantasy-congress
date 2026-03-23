import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-background via-background to-card py-20 md:py-32">
      {/* Background texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-5"
        aria-hidden="true"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 50%, var(--color-primary) 0%, transparent 50%), radial-gradient(circle at 80% 20%, var(--color-party-dem) 0%, transparent 40%)',
        }}
      />

      <div className="relative mx-auto max-w-5xl px-4 text-center">
        <h1 className="text-4xl font-black tracking-tight md:text-6xl lg:text-7xl">
          DRAFT YOUR POLITICIANS.{' '}
          <span className="text-primary">PROFIT FROM THEIR TRADES.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
          The fantasy sports league where Congressional stock trades are the game. Real politicians.
          Real trades. Real corruption scores.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/politicians"
            className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-[1.02] active:translate-y-px"
          >
            Explore Politicians
          </Link>
          <Link
            href="/feed"
            className="inline-flex h-12 items-center justify-center rounded-lg border border-border bg-background px-8 text-base font-semibold text-foreground transition-all hover:bg-muted hover:scale-[1.02] active:translate-y-px"
          >
            View Trade Feed
          </Link>
        </div>
      </div>
    </section>
  )
}
