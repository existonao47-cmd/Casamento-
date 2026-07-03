import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { listConfirmationsWithFamily } from "@/services/adminDataService";
import { exportConfirmationsToPdf } from "@/services/exportService";
import { useSEO } from "@/hooks/useSEO";

export default function Confirmacoes() {
  useSEO({ title: "Confirmações" });

  const { data: confirmations = [], isLoading } = useQuery({
    queryKey: ["admin-confirmacoes"],
    queryFn: listConfirmationsWithFamily,
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl text-ink dark:text-paper">Confirmações</h1>
        <button
          type="button"
          onClick={() => exportConfirmationsToPdf(confirmations)}
          disabled={confirmations.length === 0}
          className="flex items-center gap-2 rounded-sm border border-ink/20 px-4 py-2 font-caption text-xs uppercase tracking-wider text-ink dark:text-paper dark:border-paper/20 disabled:opacity-50"
        >
          <Download size={14} /> Exportar PDF
        </button>
      </div>

      {isLoading && <p className="mt-8 font-caption text-ink-light dark:text-paper/70">Carregando…</p>}

      <table className="mt-8 w-full text-left font-serif text-sm">
        <thead>
          <tr className="border-b border-ink/10 dark:border-paper/10">
            <th className="py-2 font-caption text-xs uppercase tracking-wider text-ink-light dark:text-paper/60">Família</th>
            <th className="py-2 font-caption text-xs uppercase tracking-wider text-ink-light dark:text-paper/60">Status</th>
            <th className="py-2 font-caption text-xs uppercase tracking-wider text-ink-light dark:text-paper/60">Acompanhantes</th>
            <th className="py-2 font-caption text-xs uppercase tracking-wider text-ink-light dark:text-paper/60">Restrição</th>
            <th className="py-2 font-caption text-xs uppercase tracking-wider text-ink-light dark:text-paper/60">Data</th>
          </tr>
        </thead>
        <tbody>
          {confirmations.map((c) => (
            <tr key={c.id} className="border-b border-ink/5 dark:border-paper/5">
              <td className="py-2 text-ink dark:text-paper">{c.familia_nome}</td>
              <td className="py-2 capitalize text-ink-light dark:text-paper/70">{c.status}</td>
              <td className="py-2 text-ink-light dark:text-paper/70">{c.quantidade_acompanhantes}</td>
              <td className="py-2 text-ink-light dark:text-paper/70">{c.restricao_alimentar ?? "-"}</td>
              <td className="py-2 text-ink-light dark:text-paper/70">
                {new Date(c.confirmado_em).toLocaleDateString("pt-BR")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
