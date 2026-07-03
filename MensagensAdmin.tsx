import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { listAllMessagesAdmin, deleteMessage } from "@/services/messageService";
import { useSEO } from "@/hooks/useSEO";

export default function MensagensAdmin() {
  useSEO({ title: "Mural — Moderação" });
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["admin-mensagens"],
    queryFn: listAllMessagesAdmin,
  });

  return (
    <div>
      <h1 className="font-display text-4xl text-ink dark:text-paper">Mural — Moderação</h1>

      {isLoading && <p className="mt-8 font-caption text-ink-light dark:text-paper/70">Carregando…</p>}

      <ul className="mt-8 space-y-3">
        {messages.map((msg) => (
          <li
            key={msg.id}
            className="flex items-start justify-between rounded-sm border border-ink/10 p-4 dark:border-paper/10"
          >
            <div>
              <p className="font-serif italic text-ink dark:text-paper/90">"{msg.mensagem}"</p>
              <p className="mt-1 font-caption text-xs uppercase tracking-wider text-wine dark:text-sunflower">
                {msg.nome_convidado} · {new Date(msg.created_at).toLocaleDateString("pt-BR")}
              </p>
            </div>
            <button
              type="button"
              onClick={async () => {
                await deleteMessage(msg.id);
                await queryClient.invalidateQueries({ queryKey: ["admin-mensagens"] });
                await queryClient.invalidateQueries({ queryKey: ["mensagens"] });
              }}
              aria-label="Excluir mensagem"
            >
              <Trash2 size={16} className="text-ink-light hover:text-wine dark:text-paper/50" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
