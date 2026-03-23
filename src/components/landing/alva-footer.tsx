export function AlvaFooter() {
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
        <div className="mt-6">
          <a
            href="https://alva.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline text-sm font-medium"
          >
            Learn more at alva.ai
          </a>
        </div>
      </div>
    </section>
  )
}
