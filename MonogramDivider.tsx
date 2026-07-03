export default function MonogramDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`} aria-hidden="true">
      <span className="font-display text-4xl sm:text-5xl text-ink leading-none">A</span>
      <span className="h-10 sm:h-12 w-px bg-ink/40" />
      <span className="font-display text-4xl sm:text-5xl text-ink leading-none">D</span>
    </div>
  );
}
