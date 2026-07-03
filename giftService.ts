import { supabase } from "@/lib/supabase";
import { getStoredSession } from "@/services/adminAuthService";
import type { Presente, CategoriaPresente } from "@/types";

function requireToken(): string {
  const session = getStoredSession();
  if (!session) throw new Error("Sessão expirada. Faça login novamente.");
  return session.token;
}

export async function listGifts(): Promise<Presente[]> {
  const { data, error } = await supabase
    .from("presentes")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw new Error("Não foi possível carregar a lista de presentes.");
  return data as Presente[];
}

export async function listGiftCategories(): Promise<CategoriaPresente[]> {
  const { data, error } = await supabase
    .from("categorias_presentes")
    .select("*")
    .order("ordem", { ascending: true });

  if (error) throw new Error("Não foi possível carregar as categorias.");
  return data as CategoriaPresente[];
}

/**
 * Reserva um presente via RPC (`reserve_gift`) com verificação atômica de
 * status "disponivel -> reservado", evitando que dois convidados reservem
 * o mesmo presente simultaneamente (condição de corrida).
 */
export async function reserveGift(giftId: string, guestName: string): Promise<void> {
  const { error } = await supabase.rpc("reserve_gift", {
    p_presente_id: giftId,
    p_nome_convidado: guestName.trim().slice(0, 120),
  });

  if (error) {
    if (error.message.includes("already_reserved")) {
      throw new Error("Esse presente acabou de ser reservado por outra pessoa.");
    }
    throw new Error("Não foi possível reservar o presente. Tente novamente.");
  }
}

export async function createGift(
  gift: Omit<Presente, "id" | "created_at" | "status" | "reservado_por">,
): Promise<void> {
  const { error } = await supabase.rpc("admin_create_gift", {
    p_token: requireToken(),
    p_categoria_id: gift.categoria_id,
    p_nome: gift.nome,
    p_descricao: gift.descricao ?? "",
    p_valor: gift.valor,
    p_imagem_url: gift.imagem_url ?? "",
  });
  if (error) throw new Error("Não foi possível cadastrar o presente.");
}

export async function updateGift(id: string, updates: Partial<Presente>): Promise<void> {
  const { error } = await supabase.rpc("admin_update_gift", {
    p_token: requireToken(),
    p_id: id,
    p_nome: updates.nome ?? null,
    p_descricao: updates.descricao ?? "",
    p_valor: updates.valor ?? null,
    p_imagem_url: updates.imagem_url ?? "",
  });
  if (error) throw new Error("Não foi possível atualizar o presente.");
}

export async function deleteGift(id: string): Promise<void> {
  const { error } = await supabase.rpc("admin_delete_gift", { p_token: requireToken(), p_id: id });
  if (error) throw new Error("Não foi possível excluir o presente.");
}
