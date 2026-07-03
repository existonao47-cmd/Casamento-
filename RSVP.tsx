import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2 } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";
import { lookupInviteCode, confirmAttendance, type InviteLookupResult } from "@/services/rsvpService";
import { useSEO } from "@/hooks/useSEO";

const codeSchema = z.object({
  codigo: z.string().min(4, "Digite o código do seu convite"),
});
type CodeFormValues = z.infer<typeof codeSchema>;

const attendanceSchema = z.object({
  comparecera: z.enum(["sim", "nao"]),
  acompanhantes: z
    .array(
      z.object({
        nome: z.string().min(2, "Nome obrigatório"),
        restricaoAlimentar: z.string().optional(),
      }),
    )
    .default([]),
  mensagem: z.string().max(500).optional(),
});
type AttendanceFormValues = z.infer<typeof attendanceSchema>;

export default function RSVP() {
  useSEO({ title: "Confirmar Presença", description: "Confirme sua presença com o código do seu convite." });

  const [invite, setInvite] = useState<InviteLookupResult | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const codeForm = useForm<CodeFormValues>({ resolver: zodResolver(codeSchema) });

  const attendanceForm = useForm<AttendanceFormValues>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: { comparecera: "sim", acompanhantes: [] },
  });
  const { fields, append, remove } = useFieldArray({ control: attendanceForm.control, name: "acompanhantes" });
  const comparecera = attendanceForm.watch("comparecera");

  async function handleLookup(values: CodeFormValues) {
    setLookupError(null);
    setIsLookingUp(true);
    try {
      const result = await lookupInviteCode(values.codigo);
      if (result.ja_confirmado) {
        setLookupError("Este convite já teve a presença confirmada anteriormente.");
        return;
      }
      setInvite(result);
    } catch (err) {
      setLookupError(err instanceof Error ? err.message : "Erro ao validar o código.");
    } finally {
      setIsLookingUp(false);
    }
  }

  async function handleConfirm(values: AttendanceFormValues) {
    if (!invite) return;
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await confirmAttendance({
        codigoConviteId: invite.codigo_convite_id,
        status: values.comparecera === "sim" ? "confirmado" : "recusado",
        acompanhantes:
          values.comparecera === "sim"
            ? values.acompanhantes.map((a) => ({ nome: a.nome, restricaoAlimentar: a.restricaoAlimentar }))
            : [],
        mensagem: values.mensagem,
      });
      setConfirmed(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Não foi possível enviar sua confirmação.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const maxCompanions = invite ? Math.max(0, invite.quantidade_maxima - 1) : 0;

  return (
    <main className="mx-auto max-w-xl px-6 py-24">
      <ScrollReveal>
        <SectionHeading eyebrow="Sua Presença Importa" title="Confirmar Presença" />
      </ScrollReveal>

      {!invite && !confirmed && (
        <ScrollReveal delay={0.1}>
          <form onSubmit={codeForm.handleSubmit(handleLookup)} className="mt-12">
            <label
              htmlFor="codigo"
              className="font-caption text-xs uppercase tracking-wider text-ink-light dark:text-paper/70"
            >
              Digite o código do seu convite
            </label>
            <input
              id="codigo"
              type="text"
              placeholder="Ex: AMD001"
              {...codeForm.register("codigo")}
              className="mt-2 w-full rounded-sm border border-ink/20 bg-transparent px-4 py-3 text-center font-serif text-lg uppercase tracking-widest text-ink outline-none focus:border-wine dark:text-paper dark:border-paper/20 dark:focus:border-sunflower"
            />
            {codeForm.formState.errors.codigo && (
              <p className="mt-1 text-sm text-wine">{codeForm.formState.errors.codigo.message}</p>
            )}
            {lookupError && <p className="mt-2 text-center text-sm text-wine">{lookupError}</p>}

            <button
              type="submit"
              disabled={isLookingUp}
              className="mt-6 w-full rounded-sm border border-wine bg-wine py-3 font-caption text-sm uppercase tracking-[0.15em] text-paper hover:bg-wine-light disabled:opacity-60"
            >
              {isLookingUp ? "Verificando…" : "Continuar"}
            </button>
          </form>
        </ScrollReveal>
      )}

      {invite && !confirmed && (
        <ScrollReveal delay={0.1}>
          <p className="mt-12 text-center font-display text-3xl text-ink dark:text-paper">
            Olá, Família {invite.familia_nome}.
          </p>
          <p className="mt-2 text-center font-serif text-ink-light dark:text-paper/80">
            Estamos muito felizes por compartilhar este momento com vocês.
          </p>

          <form onSubmit={attendanceForm.handleSubmit(handleConfirm)} className="mt-10 space-y-6">
            <fieldset>
              <legend className="font-caption text-xs uppercase tracking-wider text-ink-light dark:text-paper/70">
                Vocês estarão presentes?
              </legend>
              <div className="mt-3 flex gap-4">
                <label className="flex items-center gap-2 font-serif text-ink dark:text-paper">
                  <input type="radio" value="sim" {...attendanceForm.register("comparecera")} /> Sim, estaremos lá
                </label>
                <label className="flex items-center gap-2 font-serif text-ink dark:text-paper">
                  <input type="radio" value="nao" {...attendanceForm.register("comparecera")} /> Não poderemos ir
                </label>
              </div>
            </fieldset>

            {comparecera === "sim" && (
              <div>
                <div className="flex items-center justify-between">
                  <p className="font-caption text-xs uppercase tracking-wider text-ink-light dark:text-paper/70">
                    Acompanhantes (máx. {maxCompanions})
                  </p>
                  {fields.length < maxCompanions && (
                    <button
                      type="button"
                      onClick={() => append({ nome: "", restricaoAlimentar: "" })}
                      className="flex items-center gap-1 font-caption text-xs uppercase tracking-wider text-wine dark:text-sunflower"
                    >
                      <Plus size={14} /> Adicionar
                    </button>
                  )}
                </div>

                {fields.map((field, i) => (
                  <div key={field.id} className="mt-3 flex gap-2">
                    <input
                      type="text"
                      placeholder="Nome do acompanhante"
                      {...attendanceForm.register(`acompanhantes.${i}.nome`)}
                      className="flex-1 rounded-sm border border-ink/20 bg-transparent px-3 py-2 font-serif text-sm text-ink outline-none dark:text-paper dark:border-paper/20"
                    />
                    <input
                      type="text"
                      placeholder="Restrição alimentar"
                      {...attendanceForm.register(`acompanhantes.${i}.restricaoAlimentar`)}
                      className="flex-1 rounded-sm border border-ink/20 bg-transparent px-3 py-2 font-serif text-sm text-ink outline-none dark:text-paper dark:border-paper/20"
                    />
                    <button type="button" onClick={() => remove(i)} aria-label="Remover acompanhante">
                      <Trash2 size={18} className="text-ink-light dark:text-paper/60" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div>
              <label
                htmlFor="mensagem"
                className="font-caption text-xs uppercase tracking-wider text-ink-light dark:text-paper/70"
              >
                Mensagem para o casal (opcional)
              </label>
              <textarea
                id="mensagem"
                rows={3}
                {...attendanceForm.register("mensagem")}
                className="mt-2 w-full rounded-sm border border-ink/20 bg-transparent px-4 py-3 font-serif text-ink outline-none dark:text-paper dark:border-paper/20"
              />
            </div>

            {submitError && <p className="text-center text-sm text-wine">{submitError}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-sm border border-wine bg-wine py-3 font-caption text-sm uppercase tracking-[0.15em] text-paper hover:bg-wine-light disabled:opacity-60"
            >
              {isSubmitting ? "Enviando…" : "Confirmar"}
            </button>
          </form>
        </ScrollReveal>
      )}

      {confirmed && (
        <ScrollReveal delay={0.1}>
          <div className="mt-16 text-center">
            <p className="font-display text-4xl text-wine dark:text-sunflower">Confirmação recebida!</p>
            <p className="mt-3 font-serif text-ink-light dark:text-paper/80">
              Obrigado por responder, Família {invite?.familia_nome}. Guarde este comprovante — sua confirmação foi
              registrada e o código do convite não poderá ser usado novamente.
            </p>
          </div>
        </ScrollReveal>
      )}
    </main>
  );
}
