import axios from "axios";
import type {
  Pessoas,
  PessoaInput,
  Transacao,
  TransacaoInput,
  Total,
} from "../types";

// Ajuste a URL base conforme a porta configurada no seu backend (launchSettings.json)
const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:7239";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ---------- Pessoas ----------
export const PessoasAPI = {
  listar: async (): Promise<Pessoas[]> => {
    const { data } = await api.get<Pessoas[]>("/pessoa");
    return data;
  },

  buscarPorId: async (id: number): Promise<Pessoas> => {
    const { data } = await api.get<Pessoas>(`/pessoa/${id}`);
    return data;
  },

  criar: async (Pessoas: PessoaInput): Promise<Pessoas> => {
    const { data } = await api.post<Pessoas>("/pessoa", Pessoas);
    return data;
  },

  atualizar: async (id: number, Pessoas: PessoaInput): Promise<void> => {
    await api.put(`/pessoa/${id}`, { id, ...Pessoas });
  },

  remover: async (id: number): Promise<void> => {
    await api.delete(`/pessoa/${id}`);
  },
};

// ---------- Transacoes ----------
export const TransacoesAPI = {
  listar: async (): Promise<Transacao[]> => {
    const { data } = await api.get<Transacao[]>("/transacao");
    return data;
  },

  buscarPorId: async (id: number): Promise<Transacao[]> => {
    const { data } = await api.get<Transacao>(`/transacao/${id}`);
    return data;
  },

  listarPorPessoa: async (pessoaId: number): Promise<Transacao[]> => {
    const { data } = await api.get<Transacao[]>(
      `/transacao/pessoa/${pessoaId}`
    );
    return data;
  },

  criar: async (transacao: TransacaoInput): Promise<Transacao> => {
    const { data } = await api.post<Transacao>(`pessoa/${transacao.pessoaId}/transacoes`, transacao);
    return data;
  },

  atualizar: async (id: number, transacao: TransacaoInput): Promise<void> => {
    await api.put(`/transacao/${id}`, { id, ...transacao });
  },

  remover: async (id: number): Promise<void> => {
    await api.delete(`/transacao/${id}`);
  },

  total: async (): Promise<Total> => {
    const { data } = await api.get("/pessoa/totais")
    return data;
  },

};
