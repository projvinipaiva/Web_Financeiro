// Tipos espelhando os DTOs do backend (Pessoa e Transacao)

export interface Pessoas {
  id: number;
  nome: string;
  idade?: number;
}

export type PessoaInput = Omit<Pessoas, "id">;

export type TipoTransacao = 0 | 1;

export interface Transacao {
  id: number;
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  data: string; // ISO date string, ex: "2026-07-09"
  pessoaId: number;
  pessoaNome?: string; // conveniente para exibição, se a API já fizer o join
}

export type TransacaoInput = Omit<Transacao, "id" | "pessoaNome">;

export interface TotalPorPessoa {
  pessoa: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export interface Total {
  pessoas: TotalPorPessoa[],
  totalGeralReceitas: number,
  totalGeralDespesas: number,
  saldoLiquido: number
}