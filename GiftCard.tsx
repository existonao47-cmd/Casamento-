import { formatCurrency } from "@/utils/formatters";
import type { Presente } from "@/types";

interface GiftCardProps {
  gift: Presente;
  onSelect: () => void;
}

export default function GiftCard({ gift, onSelect }: GiftCardProps) {
  const reserved = gift.status === "reservado";

  return (
    <div className="flex flex-col overflow-hidden rounded-sm border border-ink/10 bg-paper dark:bg-ink/40 dark:border-paper/10">
      <div className="aspect-square overflow-hidden bg-ink/5 dark:bg-paper/5">
        {gift.imagem_url && (
          <img
            src={gift.imagem_url}
            alt={gift.nome}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-2xl text-ink dark:text-paper">{gift.nome}</h3>
        {gift.descricao && (
          <p className="mt-1 flex-1 font-serif text-sm text-ink-light dark:text-paper/70">{gift.descricao}</p>
        )}
        <p className="mt-3 font-serif text-lg text-wine dark:text-sunflower">{formatCurrency(gift.valor)}</p>
        <button
          type="button"
          onClick={onSelect}
          disabled={reserved}
          className="mt-4 rounded-sm border border-wine px-4 py-2 font-caption text-sm uppercase tracking-[0.15em] text-wine transition-colors hover:bg-wine hover:text-paper disabled:cursor-not-allowed disabled:border-ink/20 disabled:text-ink-light/60 dark:disabled:border-paper/20 dark:disabled:text-paper/40"
        >
          {reserved ? "Já reservado" : "Presentear"}
        </button>
      </div>
    </div>
  );
}
