import { supabase } from "@/lib/supabase";
import { getStoredSession } from "@/services/adminAuthService";
import type { DashboardStats, Convidado, Familia, CodigoConvite, Confirmacao } from "@/types";

function requireToken(): string {
  const session = getStoredSession();
  if (!session) throw new Error("Sessão expirada. Faça login novamente.");
  return session.token;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const { data, error } = await supabase.rpc("get_dashboard_stats", { p_token: requireToken() });
  if (error) throw new Error("Não foi possível carregar o dashboard.");
  return data as DashboardStats;
}

export async function listFamilies(): Promise<Familia[]> {
  const { data, error } = await supabase.rpc("admin_list_families", { p_token: requireToken() });
  if (error) throw new Error("Não foi possível carregar as famílias.");
  return data as Familia[];
}

export async function createFamily(nome: string): Promise<Familia> {
  const { data, error } = await supabase.rpc("admin_create_family", { p_token: requireToken(), p_nome: nome });
  if (error) throw new Error("Não foi possível cadastrar a família.");
  return data as Familia;
}

export async function deleteFamily(id: string): Promise<void> {
  const { error } = await supabase.rpc("admin_delete_family", { p_token: requireToken(), p_id: id });
  if (error) throw new Error("Não foi possível excluir a família.");
}

export async function listGuests(): Promise<Convidado[]> {
  const { data, error } = await supabase.rpc("admin_list_guests", { p_token: requireToken() });
  if (error) throw new Error("Não foi possível carregar os convidados.");
  return data as Convidado[];
}

export async function createGuest(guest: Omit<Convidado, "id" | "created_at">): Promise<void> {
  const { error } = await supabase.rpc("admin_create_guest", {
    p_token: requireToken(),
    p_familia_id: guest.familia_id,
    p_nome: guest.nome,
    p_email: guest.email ?? "",
    p_telefone: guest.telefone ?? "",
  });
  if (error) throw new Error("Não foi possível cadastrar o convidado.");
}

export async function updateGuest(id: string, updates: Partial<Convidado>): Promise<void> {
  const { error } = await supabase.rpc("admin_update_guest", {
    p_token: requireToken(),
    p_id: id,
    p_nome: updates.nome ?? null,
    p_email: updates.email ?? "",
    p_telefone: updates.telefone ?? "",
  });
  if (error) throw new Error("Não foi possível atualizar o convidado.");
}

export async function deleteGuest(id: string): Promise<void> {
  const { error } = await supabase.rpc("admin_delete_guest", { p_token: requireToken(), p_id: id });
  if (error) throw new Error("Não foi possível excluir o convidado.");
}

export async function generateInviteCode(familiaId: string, quantidadeMaxima: number): Promise<CodigoConvite> {
  const { data, error } = await supabase.rpc("generate_invite_code", {
    p_token: requireToken(),
    p_familia_id: familiaId,
    p_quantidade_maxima: quantidadeMaxima,
  });
  if (error) throw new Error("Não foi possível gerar o código de convite.");
  return data as CodigoConvite;
}

export async function listInviteCodes(): Promise<CodigoConvite[]> {
  const { data, error } = await supabase.rpc("admin_list_invite_codes", { p_token: requireToken() });
  if (error) throw new Error("Não foi possível carregar os códigos de convite.");
  return data as CodigoConvite[];
}

export async function listConfirmationsWithFamily(): Promise<(Confirmacao & { familia_nome: string })[]> {
  const { data, error } = await supabase.rpc("admin_list_confirmations", { p_token: requireToken() });
  if (error) throw new Error("Não foi possível carregar as confirmações.");
  return data as (Confirmacao & { familia_nome: string })[];
}
