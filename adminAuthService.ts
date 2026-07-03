import { supabase } from "@/lib/supabase";

const SESSION_STORAGE_KEY = "admin_session_token";

export interface AdminSession {
  token: string;
  email: string;
  expiresAt: string;
}

/**
 * Login via RPC `admin_login`, que compara o hash com `pgcrypto` no lado do
 * banco (a senha em texto puro nunca é comparada no client) e retorna um
 * token de sessão de curta duração armazenado em `admin_sessions`.
 */
export async function adminLogin(email: string, senha: string): Promise<AdminSession> {
  const { data, error } = await supabase.rpc("admin_login", {
    p_email: email.trim().toLowerCase(),
    p_senha: senha,
  });

  if (error || !data) {
    throw new Error("E-mail ou senha inválidos.");
  }

  const session: AdminSession = {
    token: data.token,
    email: data.email,
    expiresAt: data.expires_at,
  };

  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  return session;
}

export async function adminChangePassword(currentPassword: string, newPassword: string): Promise<void> {
  const session = getStoredSession();
  if (!session) throw new Error("Sessão expirada. Faça login novamente.");

  const { error } = await supabase.rpc("admin_change_password", {
    p_token: session.token,
    p_senha_atual: currentPassword,
    p_nova_senha: newPassword,
  });

  if (error) throw new Error("Não foi possível alterar a senha. Verifique a senha atual.");
}

export function getStoredSession(): AdminSession | null {
  const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw) return null;

  try {
    const session = JSON.parse(raw) as AdminSession;
    if (new Date(session.expiresAt).getTime() <= Date.now()) {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function adminLogout(): void {
  sessionStorage.removeItem(SESSION_STORAGE_KEY);
}
