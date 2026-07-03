import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";
import { useSEO } from "@/hooks/useSEO";

interface TimelineEntry {
  year: string;
  title: string;
  text: string;
}

const TIMELINE: TimelineEntry[] = [
  {
    year: "Como nos conhecemos",
    title: "Um encontro que não foi por acaso",
    text: "Nossos caminhos se cruzaram em meio à rotina, sem pressa, do jeito que as coisas certas costumam acontecer.",
  },
  {
    year: "Primeiro encontro",
    title: "A primeira conversa",
    text: "O que começou como uma conversa despretensiosa logo se tornou o início de tudo — horas pareceram minutos.",
  },
  {
    year: "Namoro",
    title: "Construindo uma história",
    text: "Entre risadas, planos e o dia a dia, fomos descobrindo que queríamos caminhar juntos por muito mais tempo.",
  },
  {
    year: "Pedido de casamento",
    title: "O sim antes do Sim",
    text: "Em um momento simples e verdadeiro, um pedido — e um coração inteiro dizendo sim antes mesmo da resposta.",
  },
  {
    year: "Grande dia",
    title: "14 de novembro de 2026",
    text: "Agora é hora de celebrar, cercados de quem amamos, o começo do resto das nossas vidas.",
  },
];

export default function NossaHistoria() {
  useSEO({
    title: "Nossa História",
    description: "Como Amanda e Deivison se conheceram até o grande dia.",
  });

  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <ScrollReveal>
        <SectionHeading eyebrow="Nossa Jornada" title="Nossa História" />
      </ScrollReveal>

      <ol className="relative mt-16 border-l border-ink/15 dark:border-paper/15 pl-8 sm:pl-10">
        {TIMELINE.map((entry, i) => (
          <ScrollReveal key={entry.title} delay={i * 0.05} as="section" className="relative mb-14 last:mb-0">
            <span
              className="absolute -left-[41px] sm:-left-[49px] top-1 h-3 w-3 rounded-full bg-wine dark:bg-sunflower"
              aria-hidden="true"
            />
            <p className="font-caption text-xs uppercase tracking-[0.25em] text-wine dark:text-sunflower">
              {entry.year}
            </p>
            <h3 className="mt-1 font-display text-3xl text-ink dark:text-paper">{entry.title}</h3>
            <p className="mt-2 font-serif text-ink-light dark:text-paper/80 leading-relaxed">{entry.text}</p>
          </ScrollReveal>
        ))}
      </ol>
    </main>
  );
}
