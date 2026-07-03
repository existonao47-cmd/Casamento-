import { supabase } from "@/lib/supabase";
import { normalizeInviteCode } from "@/utils/formatters";
import { sanitizeText } from "@/utils/sanitize";

export interface InviteLookupResult {
  familia_nome: string;
  codigo_convite_id: string;
  quantidade_maxima: number;
  ja_confirmado: boolean;
}

export interface ConfirmPresencePayload {
  codigoConviteId: string;
  status: "confirmado" | "recusado";
  acompanhantes: { nome: string; restricaoAlimentar?: string }[];
  mensagem?: string;
}

/**
 * Busca o convite pelo código impresso. Usa RPC (`lookup_invite_code`) em vez
 * de select direto na tabela `codigos_convite`, pois a policy de leitura
 * pública dessa tabela é bloqueada — só a função com SECURITY DEFINER pode
 * consultar, o que impede enumeração de códigos por força bruta no client.
 */
export async function lookupInviteCode(rawCode: string): Promise<InviteLookupResult> {
  const codigo = normalizeInviteCode(rawCode);

  if (codigo.length < 4) {
    throw new Error("Código de convite inválido.");
  }

  const { data, error } = await supabase.rpc("lookup_invite_code", {
    p_codigo: codigo,
  });

  if (error) {
    throw new Error("Não foi possível validar o código. Verifique e tente novamente.");
  }

  if (!data) {
    throw new Error("Código não encontrado. Confira o código impresso no seu convite.");
  }

  return data as InviteLookupResult;
}

/**
 * Confirma presença via RPC `confirm_attendance`, que dentro de uma única
 * transação: valida que o código não foi usado, insere a confirmação,
 * insere os acompanhantes e marca o código como utilizado — evitando
 * condição de corrida entre "verificar" e "usar" o código.
 */
export async function confirmAttendance(payload: ConfirmPresencePayload) {
  const { error } = await supabase.rpc("confirm_attendance", {
    p_codigo_convite_id: payload.codigoConviteId,
    p_status: payload.status,
    p_acompanhantes: payload.acompanhantes.map((a) => ({
      nome: sanitizeText(a.nome),
      restricao_alimentar: a.restricaoAlimentar ? sanitizeText(a.restricaoAlimentar) : null,
    })),
    p_mensagem: payload.mensagem ? sanitizeText(payload.mensagem) : null,
  });

  if (error) {
    if (error.message.includes("already_used")) {
      throw new Error("Este código já foi utilizado para confirmar presença.");
    }
    throw new Error("Não foi possível confirmar sua presença. Tente novamente em instantes.");
  }
}
