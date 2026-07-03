import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";
import { useSEO } from "@/hooks/useSEO";

const PALETTE = [
  { name: "Vinho", hex: "#6E1F2B" },
  { name: "Azul-marinho", hex: "#2E3A55" },
  { name: "Dourado", hex: "#D6A227" },
  { name: "Verde-sálvia", hex: "#7C8A6B" },
  { name: "Champagne", hex: "#EFE6D2" },
];

const GUIDANCE = [
  {
    title: "Esfoque-se em tons terrosos e clássicos",
    text: "Prefira as cores da nossa paleta ou tons neutros como bege, marfim e champagne.",
  },
  {
    title: "Traje social",
    text: "Vestidos longos ou midi para elas, terno ou blazer para eles. Conforto com elegância.",
  },
  {
    title: "Evite branco e tons muito claros",
    text: "Esses tons são reservados para a noiva — pedimos que os convidados evitem branco e off-white.",
  },
];

export default function DressCode() {
  useSEO({ title: "Dress Code", description: "Traje sugerido para o casamento." });

  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <ScrollReveal>
        <SectionHeading
          eyebrow="Traje"
          title="Dress Code"
          subtitle="Traje social, inspirado na paleta do nosso convite."
        />
      </ScrollReveal>

      <ScrollReveal delay={0.15}>
        <div className="mt-14 flex flex-wrap justify-center gap-6">
          {PALETTE.map((color) => (
            <div key={color.hex} className="flex flex-col items-center gap-2">
              <span
                className="h-14 w-14 rounded-full border border-ink/10 dark:border-paper/20"
                style={{ backgroundColor: color.hex }}
                aria-hidden="true"
              />
              <span className="font-caption text-xs uppercase tracking-wider text-ink-light dark:text-paper/70">
                {color.name}
              </span>
            </div>
          ))}
        </div>
      </ScrollReveal>

      <div className="mt-16 grid gap-8 sm:grid-cols-3">
        {GUIDANCE.map((item, i) => (
          <ScrollReveal key={item.title} delay={0.1 + i * 0.1}>
            <h3 className="font-display text-2xl text-ink dark:text-paper">{item.title}</h3>
            <p className="mt-2 font-serif text-sm text-ink-light dark:text-paper/80 leading-relaxed">
              {item.text}
            </p>
          </ScrollReveal>
        ))}
      </div>
    </main>
  );
}
