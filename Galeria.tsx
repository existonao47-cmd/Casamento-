import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";
import GalleryLightbox from "@/components/GalleryLightbox";
import { listGalleryItems } from "@/services/galleryService";
import { useSEO } from "@/hooks/useSEO";

export default function Galeria() {
  useSEO({ title: "Galeria", description: "Momentos de Amanda e Deivison." });
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const { data: items = [], isLoading, isError } = useQuery({
    queryKey: ["galeria"],
    queryFn: listGalleryItems,
  });

  return (
    <main className="mx-auto max-w-6xl px-6 py-24">
      <ScrollReveal>
        <SectionHeading eyebrow="Memórias" title="Galeria" />
      </ScrollReveal>

      {isLoading && (
        <p className="mt-16 text-center font-caption text-ink-light dark:text-paper/70">Carregando fotos…</p>
      )}

      {isError && (
        <p className="mt-16 text-center font-caption text-wine">
          Não foi possível carregar a galeria no momento.
        </p>
      )}

      {!isLoading && !isError && items.length === 0 && (
        <p className="mt-16 text-center font-caption text-ink-light dark:text-paper/70">
          As fotos serão publicadas em breve.
        </p>
      )}

      <div className="mt-16 columns-2 sm:columns-3 gap-4 [&>*]:mb-4">
        {items.map((item, i) => (
          <ScrollReveal key={item.id} delay={(i % 6) * 0.05}>
            <button
              type="button"
              onClick={() => setActiveIndex(i)}
              className="block w-full overflow-hidden rounded-sm border border-ink/10 dark:border-paper/10"
            >
              <img
                src={item.imagem_url}
                alt={item.legenda ?? "Foto de Amanda e Deivison"}
                loading="lazy"
                className="w-full transition-transform duration-500 hover:scale-105"
              />
            </button>
          </ScrollReveal>
        ))}
      </div>

      {activeIndex !== null && (
        <GalleryLightbox
          items={items}
          index={activeIndex}
          onClose={() => setActiveIndex(null)}
          onNavigate={setActiveIndex}
        />
      )}
    </main>
  );
}
