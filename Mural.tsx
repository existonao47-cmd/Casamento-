import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";
import { listApprovedMessages, submitMessage } from "@/services/messageService";
import { useSEO } from "@/hooks/useSEO";

const schema = z.object({
  nome: z.string().min(2, "Informe seu nome").max(80),
  mensagem: z.string().min(3, "Escreva uma mensagem").max(500),
});
type FormValues = z.infer<typeof schema>;

export default function Mural() {
  useSEO({ title: "Mural de Recados", description: "Deixe uma mensagem para Amanda e Deivison." });
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["mensagens"],
    queryFn: listApprovedMessages,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    await submitMessage(values.nome, values.mensagem);
    reset();
    await queryClient.invalidateQueries({ queryKey: ["mensagens"] });
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <ScrollReveal>
        <SectionHeading eyebrow="Deixe seu Carinho" title="Mural de Recados" />
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-12 space-y-4">
          <div>
            <label htmlFor="nome" className="font-caption text-xs uppercase tracking-wider text-ink-light dark:text-paper/70">
              Seu nome
            </label>
            <input
              id="nome"
              type="text"
              {...register("nome")}
              className="mt-2 w-full rounded-sm border border-ink/20 bg-transparent px-4 py-2 font-serif text-ink outline-none dark:text-paper dark:border-paper/20"
            />
            {errors.nome && <p className="mt-1 text-sm text-wine">{errors.nome.message}</p>}
          </div>

          <div>
            <label htmlFor="mensagem" className="font-caption text-xs uppercase tracking-wider text-ink-light dark:text-paper/70">
              Sua mensagem
            </label>
            <textarea
              id="mensagem"
              rows={3}
              {...register("mensagem")}
              className="mt-2 w-full rounded-sm border border-ink/20 bg-transparent px-4 py-2 font-serif text-ink outline-none dark:text-paper dark:border-paper/20"
            />
            {errors.mensagem && <p className="mt-1 text-sm text-wine">{errors.mensagem.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-sm border border-wine bg-wine px-6 py-3 font-caption text-sm uppercase tracking-[0.15em] text-paper hover:bg-wine-light disabled:opacity-60"
          >
            {isSubmitting ? "Enviando…" : "Enviar Mensagem"}
          </button>
        </form>
      </ScrollReveal>

      {isLoading && (
        <p className="mt-16 text-center font-caption text-ink-light dark:text-paper/70">Carregando mensagens…</p>
      )}

      <div className="mt-16 grid gap-5 sm:grid-cols-2">
        {messages.map((msg, i) => (
          <ScrollReveal key={msg.id} delay={(i % 6) * 0.05}>
            <div className="rounded-sm border border-ink/10 bg-paper p-5 dark:bg-ink/40 dark:border-paper/10">
              <p className="font-serif italic text-ink dark:text-paper/90">"{msg.mensagem}"</p>
              <p className="mt-3 font-caption text-xs uppercase tracking-wider text-wine dark:text-sunflower">
                {msg.nome_convidado}
              </p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </main>
  );
}
