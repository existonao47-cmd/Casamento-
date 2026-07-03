/**
 * Sanitiza texto livre vindo de formulários públicos (mensagens do mural,
 * restrições alimentares, etc.) removendo marcação HTML e caracteres de
 * controle antes de enviar ao banco. Isso complementa — não substitui —
 * as Row Level Security Policies e a validação Zod nos formulários.
 */
export function sanitizeText(input: string): string {
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim()
    .slice(0, 2000);
}
