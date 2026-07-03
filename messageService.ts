import { supabase } from "@/lib/supabase";
import { sanitizeText } from "@/utils/sanitize";
import { getStoredSession } from "@/services/adminAuthService";
import type { Mensagem } from "@/types";

export async function listApprovedMessages(): Promise<Mensagem[]> {
  const { data, error } = await supabase
    .from("mensagens")
    .select("*")
    .eq("aprovado", true)
    .order("created_at", { ascending: false });

  if (error) throw new Error("Não foi possível carregar o mural de recados.");
  return data as Mensagem[];
}

export async function submitMessage(nome: string, mensagem: string): Promise<void> {
  const { error } = await supabase.from("mensagens").insert({
    nome_convidado: sanitizeText(nome).slice(0, 80),
    mensagem: sanitizeText(mensagem),
    aprovado: true,
  });

  if (error) throw new Error("Não foi possível enviar sua mensagem. Tente novamente.");
}

/** Lista todas as mensagens (aprovadas ou não) — uso exclusivo do admin. */
export async function listAllMessagesAdmin(): Promise<Mensagem[]> {
  const session = getStoredSession();
  if (!session) throw new Error("Sessão expirada. Faça login novamente.");

  const { data, error } = await supabase.rpc("admin_list_messages", { p_token: session.token });
  if (error) throw new Error("Não foi possível carregar as mensagens.");
  return data as Mensagem[];
}

export async function deleteMessage(id: string): Promise<void> {
  const session = getStoredSession();
  if (!session) throw new Error("Sessão expirada. Faça login novamente.");

  const { error } = await supabase.rpc("admin_delete_message", { p_token: session.token, p_id: id });
  if (error) throw new Error("Não foi possível excluir a mensagem.");
}
