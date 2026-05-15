interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}
export function PageHeader({ eyebrow, title, subtitle }: Props) {
  return (
    <section className="border-b border-[color:var(--border)] bg-[color:var(--muted)]/30">
      <div className="container-page py-14 md:py-20">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--secondary)] mb-3">
            {eyebrow}
          </p>
        )}
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-balance">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-base md:text-lg text-[color:var(--muted-foreground)]">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
