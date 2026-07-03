export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-paper dark:bg-ink">
      <span className="font-display text-5xl text-wine dark:text-sunflower animate-pulse">
        A&nbsp;|&nbsp;D
      </span>
      <span className="mt-3 font-caption text-xs uppercase tracking-[0.3em] text-ink-light dark:text-paper/70">
        carregando
      </span>
    </div>
  );
}
