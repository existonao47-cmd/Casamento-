import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Search } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";
import GiftCard from "@/components/GiftCard";
import ReserveGiftModal from "@/components/ReserveGiftModal";
import { listGifts, listGiftCategories, reserveGift } from "@/services/giftService";
import { useSEO } from "@/hooks/useSEO";
import type { Presente } from "@/types";

export default function Presentes() {
  useSEO({ title: "Lista de Presentes", description: "Escolha um presente para Amanda e Deivison." });

  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<string>("todas");
  const [maxPrice, setMaxPrice] = useState<string>("todos");
  const [selectedGift, setSelectedGift] = useState<Presente | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const { data: gifts = [], isLoading } = useQuery({ queryKey: ["presentes"], queryFn: listGifts });
  const { data: categories = [] } = useQuery({ queryKey: ["categorias-presentes"], queryFn: listGiftCategories });

  const filtered = useMemo(() => {
    return gifts.filter((g) => {
      const matchesSearch = g.nome.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryId === "todas" || g.categoria_id === categoryId;
      const matchesPrice =
        maxPrice === "todos" ||
        (maxPrice === "ate200" && g.valor <= 200) ||
        (maxPrice === "200a500" && g.valor > 200 && g.valor <= 500) ||
        (maxPrice === "acima500" && g.valor > 500);
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [gifts, search, categoryId, maxPrice]);

  const reservedCount = gifts.filter((g) => g.status === "reservado").length;
  const progress = gifts.length > 0 ? Math.round((reservedCount / gifts.length) * 100) : 0;

  async function handleConfirmReservation(name: string) {
    if (!selectedGift) return;
    setIsSubmitting(true);
    try {
      await reserveGift(selectedGift.id, name);
      await queryClient.invalidateQueries({ queryKey: ["presentes"] });
      setFeedback(`Obrigado! "${selectedGift.nome}" foi reservado com carinho.`);
      setSelectedGift(null);
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : "Não foi possível reservar o presente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-24">
      <ScrollReveal>
        <SectionHeading
          eyebrow="Com Carinho"
          title="Lista de Presentes"
          subtitle="Sua presença é o nosso maior presente. Se quiser nos ajudar a começar essa nova fase, ficaremos gratos por qualquer escolha."
        />
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <div className="mx-auto mt-10 max-w-md">
          <div className="h-2 w-full overflow-hidden rounded-full bg-ink/10 dark:bg-paper/10">
            <div className="h-full bg-wine dark:bg-sunflower transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2 text-center font-caption text-xs uppercase tracking-wider text-ink-light dark:text-paper/70">
            {reservedCount} de {gifts.length} presentes já escolhidos
          </p>
        </div>
      </ScrollReveal>

      {feedback && (
        <p className="mt-6 text-center font-caption text-sm text-wine dark:text-sunflower" role="status">
          {feedback}
        </p>
      )}

      <ScrollReveal delay={0.15}>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="flex items-center gap-2 rounded-sm border border-ink/20 px-3 py-2 dark:border-paper/20">
            <Search size={16} className="text-ink-light dark:text-paper/60" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar presente…"
              className="bg-transparent font-serif text-sm text-ink outline-none dark:text-paper"
            />
          </div>

          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="rounded-sm border border-ink/20 bg-transparent px-3 py-2 font-serif text-sm text-ink dark:text-paper dark:border-paper/20"
          >
            <option value="todas">Todas as categorias</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nome}
              </option>
            ))}
          </select>

          <select
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="rounded-sm border border-ink/20 bg-transparent px-3 py-2 font-serif text-sm text-ink dark:text-paper dark:border-paper/20"
          >
            <option value="todos">Qualquer valor</option>
            <option value="ate200">Até R$ 200</option>
            <option value="200a500">R$ 200 a R$ 500</option>
            <option value="acima500">Acima de R$ 500</option>
          </select>
        </div>
      </ScrollReveal>

      {isLoading && (
        <p className="mt-16 text-center font-caption text-ink-light dark:text-paper/70">Carregando presentes…</p>
      )}

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((gift, i) => (
          <ScrollReveal key={gift.id} delay={(i % 6) * 0.05}>
            <GiftCard gift={gift} onSelect={() => setSelectedGift(gift)} />
          </ScrollReveal>
        ))}
      </div>

      {!isLoading && filtered.length === 0 && (
        <p className="mt-16 text-center font-caption text-ink-light dark:text-paper/70">
          Nenhum presente encontrado com esses filtros.
        </p>
      )}

      {selectedGift && (
        <ReserveGiftModal
          gift={selectedGift}
          isSubmitting={isSubmitting}
          onClose={() => setSelectedGift(null)}
          onConfirm={handleConfirmReservation}
        />
      )}
    </main>
  );
}
