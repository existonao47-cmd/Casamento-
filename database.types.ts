export type ConfirmationStatus = "pendente" | "confirmado" | "recusado";
export type GiftStatus = "disponivel" | "reservado";

export interface Familia {
  id: string;
  nome: string;
  created_at: string;
}

export interface CodigoConvite {
  id: string;
  codigo: string;
  familia_id: string;
  quantidade_maxima: number;
  utilizado: boolean;
  created_at: string;
}

export interface Convidado {
  id: string;
  familia_id: string;
  nome: string;
  email: string | null;
  telefone: string | null;
  created_at: string;
}

export interface Acompanhante {
  id: string;
  confirmacao_id: string;
  nome: string;
  restricao_alimentar: string | null;
}

export interface Confirmacao {
  id: string;
  codigo_convite_id: string;
  familia_id: string;
  status: ConfirmationStatus;
  quantidade_acompanhantes: number;
  restricao_alimentar: string | null;
  mensagem: string | null;
  confirmado_em: string;
}

export interface CategoriaPresente {
  id: string;
  nome: string;
  ordem: number;
}

export interface Presente {
  id: string;
  categoria_id: string;
  nome: string;
  descricao: string | null;
  valor: number;
  imagem_url: string | null;
  status: GiftStatus;
  reservado_por: string | null;
  created_at: string;
}

export interface Mensagem {
  id: string;
  nome_convidado: string;
  mensagem: string;
  aprovado: boolean;
  created_at: string;
}

export interface ItemGaleria {
  id: string;
  imagem_url: string;
  legenda: string | null;
  ordem: number;
  created_at: string;
}

export interface ConfiguracaoSite {
  chave: string;
  valor: string;
}

export interface AdminUsuario {
  id: string;
  email: string;
  senha_hash: string;
  criado_em: string;
}

export interface DashboardStats {
  totalConvidados: number;
  confirmados: number;
  pendentes: number;
  recusados: number;
  totalAcompanhantes: number;
  presentesReservados: number;
  totalMensagens: number;
}
