import { useMemo } from "react";

const PETAL_COUNT = 7;

/**
 * Pétalas caindo discretamente. Poucas unidades, opacidade baixa, para não
 * competir com o conteúdo — e respeitando prefers-reduced-motion via a
 * classe utilitária global definida em index.css.
 */
export default function PetalsFall() {
  const petals = useMemo(
    () =>
      Array.from({ length: PETAL_COUNT }).map((_, i) => ({
        id: i,
        left: `${(i / PETAL_COUNT) * 100 + Math.random() * 8}%`,
        delay: `${i * 1.8}s`,
        duration: `${14 + (i % 3) * 3}s`,
        size: 8 + (i % 3) * 3,
        color: i % 2 === 0 ? "#6E1F2B" : "#D6A227",
      })),
    [],
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {petals.map((petal) => (
        <span
          key={petal.id}
          className="absolute top-0 animate-petal rounded-full opacity-30"
          style={{
            left: petal.left,
            width: petal.size,
            height: petal.size * 0.7,
            backgroundColor: petal.color,
            animationDelay: petal.delay,
            animationDuration: petal.duration,
          }}
        />
      ))}
    </div>
  );
}
