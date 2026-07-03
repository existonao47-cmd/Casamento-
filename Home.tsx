import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import CountdownTimer from "@/components/CountdownTimer";
import FloralCorner from "@/components/FloralCorner";
import MonogramDivider from "@/components/MonogramDivider";
import MainLayout from "@/layouts/MainLayout";
import { useSEO } from "@/hooks/useSEO";

const WEDDING_DATE = new Date("2026-11-14T17:30:00-03:00");

export default function Home() {
  useSEO({
    title: "Início",
    description: "Amanda & Deivison se casam em 14 de novembro de 2026. Contando os dias para o nosso grande Sim.",
  });

  return (
    <MainLayout>
      <HomeContent />
    </MainLayout>
  );
}

function HomeContent() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-paper">
      <FloralCorner position="top-left" />
      <FloralCorner position="top-right" />
      <FloralCorner position="bottom-left" />
      <FloralCorner position="bottom-right" />

      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <MonogramDivider />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
          className="mt-6 font-display text-6xl sm:text-8xl text-ink text-balance"
        >
          Amanda <span className="text-wine">&amp;</span> Deivison
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="mt-4 font-caption text-lg sm:text-xl italic text-ink-light"
        >
          Contando os dias para o nosso grande Sim.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.65 }}
          className="mt-2 font-serif text-base sm:text-lg tracking-wide text-ink-light"
        >
          14 de novembro de 2026 &middot; 17:30
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.8 }}
          className="mt-12"
        >
          <CountdownTimer targetDate={WEDDING_DATE} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1 }}
          className="mt-14 flex flex-col sm:flex-row items-center gap-4"
        >
          <Link
            to="/rsvp"
            className="rounded-sm border border-wine bg-wine px-8 py-3 font-caption text-sm uppercase tracking-[0.15em] text-paper transition-colors hover:bg-wine-light"
          >
            Confirmar Presença
          </Link>
          <Link
            to="/nossa-historia"
            className="rounded-sm border border-ink/30 px-8 py-3 font-caption text-sm uppercase tracking-[0.15em] text-ink transition-colors hover:border-ink"
          >
            Nossa História
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.3 }}
          className="mt-16 max-w-md font-caption text-sm italic text-ink-light"
        >
          "Para onde fores, irei; onde tu repousares, repousarei." — Rute 1:16-18
        </motion.p>
      </section>
    </main>
  );
}
