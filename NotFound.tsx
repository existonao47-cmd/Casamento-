import { Link } from "react-router-dom";
import MonogramDivider from "@/components/MonogramDivider";
import { useSEO } from "@/hooks/useSEO";

export default function NotFound() {
  useSEO({ title: "Página não encontrada" });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <MonogramDivider />
      <h1 className="mt-6 font-display text-5xl text-ink dark:text-paper">Página não encontrada</h1>
      <p className="mt-3 font-serif text-ink-light dark:text-paper/80">
        Parece que este caminho não leva ao nosso grande dia.
      </p>
      <Link
        to="/"
        className="mt-8 rounded-sm border border-wine bg-wine px-6 py-3 font-caption text-sm uppercase tracking-[0.15em] text-paper hover:bg-wine-light"
      >
        Voltar ao Início
      </Link>
    </main>
  );
}
