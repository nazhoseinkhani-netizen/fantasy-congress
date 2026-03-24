interface AlvaFooterProps {
  variant?: 'full' | 'compact'
}

export function AlvaFooter({ variant = 'compact' }: AlvaFooterProps) {
  if (variant === 'compact') {
    return (
      <footer className="border-t border-border">
        <div className="border-t border-border py-4 px-4 mx-auto max-w-7xl flex items-center justify-between flex-wrap gap-2">
          <p className="text-xs text-muted-foreground">
            Data Sources:{' '}
            <span className="text-primary font-medium">Alva Skills API</span>
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://alva.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Learn more at alva.ai
            </a>
            <a
              href="https://alva.ai/skills"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Build Your Own
            </a>
          </div>
        </div>
      </footer>
    )
  }

  // full variant — centered layout for landing page
  return (
    <section className="border-t border-border mx-auto max-w-5xl px-4 py-12">
      <div className="text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Powered by
        </p>
        <h2 className="mb-4 text-lg font-semibold">Built on Alva</h2>
        <p className="mx-auto max-w-xl text-sm text-muted-foreground leading-relaxed">
          Fantasy Congress is powered by Alva&apos;s financial data intelligence platform.
          Real-time Congressional trading data, committee assignments, and disclosure filings
          &mdash; all accessible through Alva Skills.
        </p>
        <div className="mt-6 flex flex-col items-center gap-3">
          <a
            href="https://alva.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline text-sm font-medium"
          >
            Learn more at alva.ai
          </a>
          <a
            href="https://alva.ai/skills"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-3 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Build Your Own with Alva
          </a>
        </div>
      </div>
    </section>
  )
}
