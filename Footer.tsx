import MonogramDivider from "./MonogramDivider";

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-paper py-12 text-center dark:bg-ink dark:border-paper/10">
      <MonogramDivider />
      <p className="mt-4 font-caption text-sm italic text-ink-light dark:text-paper/70">
        14 de novembro de 2026 &middot; Paróquia Senhor do Bonfim, Ipatinga
      </p>
      <p className="mt-6 font-caption text-xs uppercase tracking-[0.2em] text-ink-light/60 dark:text-paper/40">
        Feito com carinho para Amanda &amp; Deivison
      </p>
    </footer>
  );
}
