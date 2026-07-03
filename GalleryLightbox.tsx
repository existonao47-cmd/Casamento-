import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import type { ItemGaleria } from "@/types";

interface GalleryLightboxProps {
  items: ItemGaleria[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function GalleryLightbox({ items, index, onClose, onNavigate }: GalleryLightboxProps) {
  const [zoomed, setZoomed] = useState(false);
  const item = items[index];

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate((index + 1) % items.length);
      if (e.key === "ArrowLeft") onNavigate((index - 1 + items.length) % items.length);
    }
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [index, items.length, onClose, onNavigate]);

  useEffect(() => setZoomed(false), [index]);

  if (!item) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        role="dialog"
        aria-modal="true"
        aria-label="Visualização ampliada da foto"
        className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 px-4"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-4 top-4 text-paper/80 hover:text-paper"
        >
          <X size={28} />
        </button>

        <button
          type="button"
          onClick={() => onNavigate((index - 1 + items.length) % items.length)}
          aria-label="Foto anterior"
          className="absolute left-2 sm:left-6 text-paper/70 hover:text-paper"
        >
          <ChevronLeft size={32} />
        </button>

        <motion.img
          key={item.id}
          src={item.imagem_url}
          alt={item.legenda ?? "Foto do casal"}
          onClick={() => setZoomed((v) => !v)}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`max-h-[85vh] max-w-[90vw] cursor-zoom-in rounded-sm object-contain transition-transform duration-300 ${
            zoomed ? "scale-150 cursor-zoom-out" : ""
          }`}
        />

        <button
          type="button"
          onClick={() => onNavigate((index + 1) % items.length)}
          aria-label="Próxima foto"
          className="absolute right-2 sm:right-6 text-paper/70 hover:text-paper"
        >
          <ChevronRight size={32} />
        </button>

        <button
          type="button"
          onClick={() => setZoomed((v) => !v)}
          aria-label={zoomed ? "Diminuir zoom" : "Aumentar zoom"}
          className="absolute bottom-6 text-paper/70 hover:text-paper"
        >
          {zoomed ? <ZoomOut size={22} /> : <ZoomIn size={22} />}
        </button>

        {item.legenda && (
          <p className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 font-caption text-sm text-paper/70 sm:block">
            {item.legenda}
          </p>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
