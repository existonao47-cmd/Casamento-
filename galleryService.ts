import { supabase } from "@/lib/supabase";
import { getStoredSession } from "@/services/adminAuthService";
import type { ItemGaleria } from "@/types";

export async function listGalleryItems(): Promise<ItemGaleria[]> {
  const { data, error } = await supabase
    .from("galeria")
    .select("*")
    .order("ordem", { ascending: true });

  if (error) throw new Error("Não foi possível carregar a galeria.");
  return data as ItemGaleria[];
}

/**
 * Upload de imagem da galeria. Passa pela Edge Function
 * `admin-upload-gallery`, que valida o token de sessão do admin com a
 * service role key (bypassando RLS) antes de gravar no Storage e na
 * tabela `galeria` — o client nunca tem permissão de escrita direta.
 */
export async function uploadGalleryImage(file: File, legenda?: string, ordem?: number): Promise<ItemGaleria> {
  const session = getStoredSession();
  if (!session) throw new Error("Sessão expirada. Faça login novamente.");

  const form = new FormData();
  form.append("token", session.token);
  form.append("file", file);
  if (legenda) form.append("legenda", legenda);
  if (typeof ordem === "number") form.append("ordem", String(ordem));

  const { data, error } = await supabase.functions.invoke("admin-upload-gallery", { body: form });

  if (error || data?.error) {
    throw new Error("Não foi possível enviar a imagem.");
  }

  return data.item as ItemGaleria;
}

export async function deleteGalleryItem(id: string): Promise<void> {
  const session = getStoredSession();
  if (!session) throw new Error("Sessão expirada. Faça login novamente.");

  const { error } = await supabase.rpc("admin_delete_gallery_item", {
    p_token: session.token,
    p_id: id,
  });

  if (error) throw new Error("Não foi possível remover a imagem.");
}
