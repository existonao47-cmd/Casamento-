interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}

export default function SectionHeading({ eyebrow, title, subtitle }: SectionHeadingProps) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {eyebrow && (
        <p className="font-caption text-xs uppercase tracking-[0.3em] text-wine dark:text-sunflower">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-2 font-display text-5xl sm:text-6xl text-ink dark:text-paper text-balance">
        {title}
      </h2>
      <div className="mx-auto mt-4 h-px w-16 bg-ink/30 dark:bg-paper/30" />
      {subtitle && (
        <p className="mt-4 font-serif text-base sm:text-lg text-ink-light dark:text-paper/80 text-balance">
          {subtitle}
        </p>
      )}
    </div>
  );
}
