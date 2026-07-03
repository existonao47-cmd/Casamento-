import { useEffect, useRef } from "react";

/**
 * Anel discreto que segue o cursor em telas com mouse (pointer: fine).
 * Não substitui o cursor nativo, apenas o acompanha — mantém acessibilidade
 * e não interfere em toque/mobile.
 */
export default function ElegantCursor() {
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const ring = ringRef.current;
    if (!ring) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let targetX = x;
    let targetY = y;
    let raf = 0;

    function handleMove(e: MouseEvent) {
      targetX = e.clientX;
      targetY = e.clientY;
    }

    function animate() {
      x += (targetX - x) * 0.18;
      y += (targetY - y) * 0.18;
      if (ring) ring.style.transform = `translate3d(${x - 12}px, ${y - 12}px, 0)`;
      raf = requestAnimationFrame(animate);
    }

    window.addEventListener("mousemove", handleMove);
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ringRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[60] hidden h-6 w-6 rounded-full border border-wine/50 dark:border-sunflower/50 [@media(pointer:fine)]:block"
    />
  );
}
