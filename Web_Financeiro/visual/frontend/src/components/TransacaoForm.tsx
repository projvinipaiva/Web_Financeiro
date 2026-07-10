import { useEffect, useState } from "react";
import type { Pessoas, Transacao, TransacaoInput, TipoTransacao } from "../types";

interface TransacaoFormProps {
  pessoas: Pessoas[];
  transacaoEmEdicao: Transacao | null;
  onSalvar: (dados: TransacaoInput) => Promise<void>;
  onCancelar: () => void;
}

function valoresIniciais(pessoas: Pessoas[]): TransacaoInput {
  return {
    descricao: "",
    valor: 0,
    tipo: 0,
    data: new Date().toISOString().slice(0, 10),
    pessoaId: pessoas[0]?.id ?? 0,
  };
}

export default function TransacaoForm({
  pessoas,
  transacaoEmEdicao,
  onSalvar,
  onCancelar,
}: TransacaoFormProps) {
  const [dados, setDados] = useState<TransacaoInput>(valoresIniciais(pessoas));
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    setDados(
      transacaoEmEdicao
        ? {
            descricao: transacaoEmEdicao.descricao,
            valor: transacaoEmEdicao.valor,
            tipo: transacaoEmEdicao.tipo,
            data: transacaoEmEdicao.data.slice(0, 10),
            pessoaId: transacaoEmEdicao.pessoaId,
          }
        : valoresIniciais(pessoas)
    );
    setErro(null);
  }, [transacaoEmEdicao, pessoas]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dados.descricao.trim()) {
      setErro("Descreva a transação.");
      return;
    }
    if (!dados.pessoaId) {
      setErro("Cadastre uma pessoa antes de lançar transações.");
      return;
    }
    if (dados.valor <= 0) {
      setErro("O valor deve ser maior que zero.");
      return;
    }
    setErro(null);
    setEnviando(true);
    try {
      await onSalvar(dados);
      setDados(valoresIniciais(pessoas));
    } catch {
      setErro("Não foi possível salvar. Confira o backend e tente de novo.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form className="card form form--faixa" onSubmit={handleSubmit}>
      <h3>{transacaoEmEdicao ? "Editar transação" : "Nova transação"}</h3>

      <div className="form__campos">
        <label className="field field--descricao">
          <span>Descrição</span>
          <input
            type="text"
            value={dados.descricao}
            onChange={(e) => setDados({ ...dados, descricao: e.target.value })}
            placeholder="Ex: Mercado, salário, aluguel..."
            autoFocus
          />
        </label>

        <label className="field">
          <span>Valor (R$)</span>
          <input
            type="number"
            min={0}
            step="0.01"
            value={dados.valor}
            onChange={(e) =>
              setDados({ ...dados, valor: parseFloat(e.target.value) || 0 })
            }
          />
        </label>

        <label className="field">
          <span>Tipo</span>
          <select
            value={dados.tipo}
            onChange={(e) =>
              setDados({ ...dados, tipo: Number(e.target.value) as TipoTransacao })
            }
          >
            <option value={0}>Receita (Entrada)</option>
            <option value={1}>Despesa (Saída)</option>
          </select>
        </label>

        <label className="field">
          <span>Data</span>
          <input
            type="date"
            value={dados.data}
            onChange={(e) => setDados({ ...dados, data: e.target.value })}
          />
        </label>

        <label className="field">
          <span>Pessoa</span>
          <select
            value={dados.pessoaId}
            onChange={(e) =>
              setDados({ ...dados, pessoaId: Number(e.target.value) })
            }
          >
            {pessoas.length === 0 && <option value={0}>Nenhuma cadastrada</option>}
            {pessoas.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>
        </label>
      </div>

      {erro && <p className="form__erro">{erro}</p>}

      <div className="form__acoes">
        <button type="submit" className="btn btn--primario" disabled={enviando}>
          {enviando
            ? "Salvando..."
            : transacaoEmEdicao
            ? "Salvar alterações"
            : "Lançar"}
        </button>
        {transacaoEmEdicao && (
          <button type="button" className="btn" onClick={onCancelar}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
