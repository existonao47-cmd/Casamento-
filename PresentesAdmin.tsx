import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { listGifts, listGiftCategories, createGift, deleteGift } from "@/services/giftService";
import { formatCurrency } from "@/utils/formatters";
import { useSEO } from "@/hooks/useSEO";

const schema = z.object({
  categoria_id: z.string().min(1, "Selecione a categoria"),
  nome: z.string().min(2, "Nome obrigatório"),
  descricao: z.string().optional(),
  valor: z.coerce.number().min(1, "Informe um valor"),
  imagem_url: z.string().url("URL de imagem inválida").optional().or(z.literal("")),
});
type FormValues = z.infer<typeof schema>;

export default function PresentesAdmin() {
  useSEO({ title: "Gerenciar Presentes" });
  const queryClient = useQueryClient();

  const { data: gifts = [] } = useQuery({ queryKey: ["presentes"], queryFn: listGifts });
  const { data: categories = [] } = useQuery({ queryKey: ["categorias-presentes"], queryFn: listGiftCategories });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    await createGift({
      categoria_id: values.categoria_id,
      nome: values.nome,
      descricao: values.descricao || null,
      valor: values.valor,
      imagem_url: values.imagem_url || null,
    });
    reset();
    await queryClient.invalidateQueries({ queryKey: ["presentes"] });
  }

  return (
    <div>
      <h1 className="font-display text-4xl text-ink dark:text-paper">Gerenciar Presentes</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid gap-3 sm:grid-cols-2">
        <select
          {...register("categoria_id")}
          className="rounded-sm border border-ink/20 bg-transparent px-3 py-2 font-serif text-sm text-ink dark:text-paper dark:border-paper/20"
        >
          <option value="">Categoria</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Nome do presente"
          {...register("nome")}
          className="rounded-sm border border-ink/20 bg-transparent px-3 py-2 font-serif text-sm text-ink outline-none dark:text-paper dark:border-paper/20"
        />
        <input
          type="number"
          step="0.01"
          placeholder="Valor (R$)"
          {...register("valor")}
          className="rounded-sm border border-ink/20 bg-transparent px-3 py-2 font-serif text-sm text-ink outline-none dark:text-paper dark:border-paper/20"
        />
        <input
          type="url"
          placeholder="URL da imagem"
          {...register("imagem_url")}
          className="rounded-sm border border-ink/20 bg-transparent px-3 py-2 font-serif text-sm text-ink outline-none dark:text-paper dark:border-paper/20"
        />
        <textarea
          placeholder="Descrição (opcional)"
          {...register("descricao")}
          className="sm:col-span-2 rounded-sm border border-ink/20 bg-transparent px-3 py-2 font-serif text-sm text-ink outline-none dark:text-paper dark:border-paper/20"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="sm:col-span-2 rounded-sm border border-wine bg-wine px-4 py-2 font-caption text-xs uppercase tracking-wider text-paper disabled:opacity-60"
        >
          Cadastrar Presente
        </button>
        {Object.values(errors).map((err) => (
          <p key={err?.message} className="sm:col-span-2 text-sm text-wine">
            {err?.message as string}
          </p>
        ))}
      </form>

      <table className="mt-10 w-full text-left font-serif text-sm">
        <thead>
          <tr className="border-b border-ink/10 dark:border-paper/10">
            <th className="py-2 font-caption text-xs uppercase tracking-wider text-ink-light dark:text-paper/60">Nome</th>
            <th className="py-2 font-caption text-xs uppercase tracking-wider text-ink-light dark:text-paper/60">Valor</th>
            <th className="py-2 font-caption text-xs uppercase tracking-wider text-ink-light dark:text-paper/60">Status</th>
            <th className="py-2 font-caption text-xs uppercase tracking-wider text-ink-light dark:text-paper/60">Reservado por</th>
            <th className="py-2" />
          </tr>
        </thead>
        <tbody>
          {gifts.map((gift) => (
            <tr key={gift.id} className="border-b border-ink/5 dark:border-paper/5">
              <td className="py-2 text-ink dark:text-paper">{gift.nome}</td>
              <td className="py-2 text-ink-light dark:text-paper/70">{formatCurrency(gift.valor)}</td>
              <td className="py-2 text-ink-light dark:text-paper/70">{gift.status}</td>
              <td className="py-2 text-ink-light dark:text-paper/70">{gift.reservado_por ?? "-"}</td>
              <td className="py-2 text-right">
                <button
                  type="button"
                  onClick={async () => {
                    await deleteGift(gift.id);
                    await queryClient.invalidateQueries({ queryKey: ["presentes"] });
                  }}
                  aria-label={`Excluir ${gift.nome}`}
                >
                  <Trash2 size={16} className="text-ink-light hover:text-wine dark:text-paper/50" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
