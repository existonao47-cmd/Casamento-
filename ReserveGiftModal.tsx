import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { Presente } from "@/types";

const schema = z.object({
  nome: z.string().min(2, "Informe seu nome completo").max(120),
});

type FormValues = z.infer<typeof schema>;

interface ReserveGiftModalProps {
  gift: Presente;
  onConfirm: (name: string) => Promise<void>;
  onClose: () => void;
  isSubmitting: boolean;
}

export default function ReserveGiftModal({ gift, onConfirm, onClose, isSubmitting }: ReserveGiftModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    await onConfirm(values.nome);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reserve-gift-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 px-6"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-sm border border-ink/10 bg-paper p-8 dark:bg-ink dark:border-paper/10"
      >
        <div className="flex items-start justify-between">
          <h3 id="reserve-gift-title" className="font-display text-3xl text-ink dark:text-paper">
            Presentear
          </h3>
          <button type="button" onClick={onClose} aria-label="Fechar" className="text-ink-light dark:text-paper/70">
            <X size={20} />
          </button>
        </div>

        <p className="mt-2 font-serif text-ink-light dark:text-paper/80">{gift.nome}</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
          <label htmlFor="nome" className="font-caption text-xs uppercase tracking-wider text-ink-light dark:text-paper/70">
            Seu nome
          </label>
          <input
            id="nome"
            type="text"
            {...register("nome")}
            className="mt-2 w-full rounded-sm border border-ink/20 bg-transparent px-4 py-2 font-serif text-ink dark:text-paper dark:border-paper/20 focus:border-wine dark:focus:border-sunflower outline-none"
          />
          {errors.nome && <p className="mt-1 text-sm text-wine">{errors.nome.message}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full rounded-sm border border-wine bg-wine py-3 font-caption text-sm uppercase tracking-[0.15em] text-paper hover:bg-wine-light disabled:opacity-60"
          >
            {isSubmitting ? "Confirmando…" : "Confirmar Presente"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
