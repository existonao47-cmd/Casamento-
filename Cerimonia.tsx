import { CalendarPlus, MapPin } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";
import { downloadIcsEvent } from "@/utils/calendar";
import { useSEO } from "@/hooks/useSEO";

const LOCATION_NAME = "Paróquia Senhor do Bonfim";
const LOCATION_ADDRESS = "R. Graciliano Ramos, 316 — Cidade Nobre, Ipatinga - MG";
const MAPS_QUERY = encodeURIComponent(`${LOCATION_NAME}, ${LOCATION_ADDRESS}`);

export default function Cerimonia() {
  useSEO({ title: "Cerimônia", description: "Data, horário e local da cerimônia." });

  function handleAddToCalendar() {
    downloadIcsEvent({
      title: "Casamento de Amanda & Deivison",
      description: "Contando os dias para o nosso grande Sim.",
      location: `${LOCATION_NAME}, ${LOCATION_ADDRESS}`,
      start: new Date("2026-11-14T17:30:00-03:00"),
      end: new Date("2026-11-14T21:00:00-03:00"),
    });
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-24">
      <ScrollReveal>
        <SectionHeading eyebrow="O Grande Dia" title="Cerimônia" />
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <div className="mt-14 grid gap-8 sm:grid-cols-3 text-center">
          <div>
            <p className="font-caption text-xs uppercase tracking-[0.25em] text-wine dark:text-sunflower">Data</p>
            <p className="mt-2 font-serif text-xl text-ink dark:text-paper">14 de novembro de 2026</p>
          </div>
          <div>
            <p className="font-caption text-xs uppercase tracking-[0.25em] text-wine dark:text-sunflower">Horário</p>
            <p className="mt-2 font-serif text-xl text-ink dark:text-paper">17:30</p>
          </div>
          <div>
            <p className="font-caption text-xs uppercase tracking-[0.25em] text-wine dark:text-sunflower">Local</p>
            <p className="mt-2 font-serif text-xl text-ink dark:text-paper">{LOCATION_NAME}</p>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <p className="mt-6 text-center font-serif text-ink-light dark:text-paper/80">{LOCATION_ADDRESS}</p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-sm border border-wine bg-wine px-6 py-3 font-caption text-sm uppercase tracking-[0.15em] text-paper hover:bg-wine-light"
          >
            <MapPin size={16} /> Como Chegar
          </a>
          <button
            type="button"
            onClick={handleAddToCalendar}
            className="flex items-center gap-2 rounded-sm border border-ink/30 px-6 py-3 font-caption text-sm uppercase tracking-[0.15em] text-ink dark:text-paper dark:border-paper/30 hover:border-ink dark:hover:border-paper"
          >
            <CalendarPlus size={16} /> Adicionar à Agenda
          </button>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.3}>
        <div className="mt-14 overflow-hidden rounded-sm border border-ink/10 dark:border-paper/10">
          <iframe
            title="Mapa da cerimônia"
            src={`https://www.google.com/maps?q=${MAPS_QUERY}&output=embed`}
            className="h-80 w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </ScrollReveal>
    </main>
  );
}
