interface StatCardProps {
  label: string;
  value: number;
}

export default function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-sm border border-ink/10 bg-paper p-6 dark:bg-ink/40 dark:border-paper/10">
      <p className="font-caption text-xs uppercase tracking-wider text-ink-light dark:text-paper/70">{label}</p>
      <p className="mt-2 font-display text-4xl text-wine dark:text-sunflower">{value}</p>
    </div>
  );
}
