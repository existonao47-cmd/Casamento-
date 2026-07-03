// Supabase Edge Function: admin-upload-gallery
// Recebe multipart/form-data com { token, legenda?, ordem?, file }.
// Valida o token via RPC validate_admin_session (usando a service role,
// que ignora RLS) e só então faz o upload + insert na tabela `galeria`.
// Deploy: supabase functions deploy admin-upload-gallery

import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method_not_allowed" }), { status: 405 });
  }

  try {
    const form = await req.formData();
    const token = form.get("token");
    const legenda = form.get("legenda");
    const ordem = form.get("ordem");
    const file = form.get("file");

    if (typeof token !== "string" || !(file instanceof File)) {
      return new Response(JSON.stringify({ error: "invalid_request" }), { status: 400 });
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    // Valida a sessão do admin. A função lança 'invalid_session' se o
    // token não existir ou tiver expirado.
    const { error: sessionError } = await supabase.rpc("validate_admin_session", { p_token: token });
    if (sessionError) {
      return new Response(JSON.stringify({ error: "invalid_session" }), { status: 401 });
    }

    if (!file.type.startsWith("image/")) {
      return new Response(JSON.stringify({ error: "invalid_file_type" }), { status: 400 });
    }
    if (file.size > 8 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: "file_too_large" }), { status: 400 });
    }

    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `galeria/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("site-assets")
      .upload(path, file, { cacheControl: "31536000", upsert: false, contentType: file.type });

    if (uploadError) {
      return new Response(JSON.stringify({ error: "upload_failed" }), { status: 500 });
    }

    const { data: publicUrlData } = supabase.storage.from("site-assets").getPublicUrl(path);

    const { data: item, error: insertError } = await supabase
      .from("galeria")
      .insert({
        imagem_url: publicUrlData.publicUrl,
        legenda: typeof legenda === "string" && legenda.length > 0 ? legenda : null,
        ordem: typeof ordem === "string" ? Number(ordem) || 0 : 0,
      })
      .select()
      .single();

    if (insertError) {
      return new Response(JSON.stringify({ error: "insert_failed" }), { status: 500 });
    }

    return new Response(JSON.stringify({ item }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "unexpected_error" }), { status: 500 });
  }
});
