import { useEffect, useMemo, useState } from "react";
import { PessoasAPI, TransacoesAPI } from "../services/api";
import type { Pessoas, Transacao, TransacaoInput } from "../types";
import TransacaoForm from "../components/TransacaoForm";

const formatoMoeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export default function Transacoes() {
  const [transacoesDaPessoa, setTransacoesDaPessoa] = useState<Transacao[]>([]);
  const [pessoas, setPessoas] = useState<Pessoas[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [transacaoEmEdicao, setTransacaoEmEdicao] = useState<Transacao | null>(null);
  const [pessoaSelecionadaId, setPessoaSelecionadaId] = useState<number | "">("");

  const carregar = async () => {
    setCarregando(true);
    setErro(null);

    try {
      const listaPessoas = await PessoasAPI.listar();
      setPessoas(listaPessoas);
    } catch {
      setErro("Não foi possível carregar as pessoas.");
    } finally {
      setCarregando(false);
    }
  };

  const carregarTransacoes = async () => {
    if (pessoaSelecionadaId === "") {
      setTransacoesDaPessoa([]);
      return;
    }
    setCarregando(true);
    setErro(null);

    try {
      const lista = await TransacoesAPI.buscarPorId(pessoaSelecionadaId);
      setTransacoesDaPessoa(lista);
    } catch {
      setErro("Não foi possível carregar as transações.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  useEffect(() => {
    carregarTransacoes();
  }, [pessoaSelecionadaId]);

  const handleSalvar = async (dados: TransacaoInput) => {
    try {
      if (transacaoEmEdicao) {
        await TransacoesAPI.atualizar(transacaoEmEdicao.id, dados);
        setTransacaoEmEdicao(null);
      } else {
        await TransacoesAPI.criar(dados);
      }
      await Promise.all([carregar(), carregarTransacoes()]);
    } catch {
      setErro("Não foi possível salvar a transação.");
    }
  };

  const handleRemover = async (id: number) => {
    if (!confirm("Remover esta transação?")) return;
    try {
      await TransacoesAPI.remover(id);
      await Promise.all([carregar(), carregarTransacoes()]);
    } catch {
      setErro("Não foi possível remover a transação.");
    }
  };

  const resumoPessoa = useMemo(() => {
    if (pessoaSelecionadaId === "") return null;
    const totalEntradas = transacoesDaPessoa
      .filter((t) => t.tipo === 0)
      .reduce((soma, t) => soma + t.valor, 0);

    const totalSaidas = transacoesDaPessoa
      .filter((t) => t.tipo === 1)
      .reduce((soma, t) => soma + t.valor, 0);
    return { totalEntradas, totalSaidas, saldo: totalEntradas - totalSaidas };
  }, [transacoesDaPessoa, pessoaSelecionadaId]);

  return (
    <section className="pagina">
      <div className="pagina__cabecalho">
        <h2>Transações</h2>
        <p>Lance entradas e saídas, e depois busque o histórico de cada pessoa.</p>
      </div>

      {/* Faixa de cima: lançar uma nova transação, sozinha, ocupando a largura toda */}
      <div className="pagina__secao">
        <TransacaoForm
          pessoas={pessoas}
          transacaoEmEdicao={transacaoEmEdicao}
          onSalvar={handleSalvar}
          onCancelar={() => setTransacaoEmEdicao(null)}
        />
      </div>

      {/* Faixa de baixo: buscar uma pessoa e ver o que ela fez (receitas e despesas) */}
      <div className="card pagina__secao">
        <h3>Buscar pessoa</h3>
        <p className="secao__ajuda">
          Selecione uma pessoa para ver o histórico dela: o que foi receita (entrada)
          e o que foi despesa (saída).
        </p>

        <label className="field field--busca">
          <span>Pessoa</span>
          <select
            value={pessoaSelecionadaId}
            onChange={(e) =>
              setPessoaSelecionadaId(e.target.value === "" ? "" : Number(e.target.value))
            }
          >
            <option value="">Selecione uma pessoa...</option>
            {pessoas.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>
        </label>

        {erro && <p className="form__erro">{erro}</p>}

        {pessoaSelecionadaId === "" ? (
          <p className="vazio">Escolha uma pessoa acima para ver as transações dela.</p>
        ) : carregando ? (
          <p className="vazio">Carregando...</p>
        ) : (
          <>
            {resumoPessoa && (
              <div className="busca__resumo">
                <span>
                  Receitas: <strong className="valor--positivo">{formatoMoeda.format(resumoPessoa.totalEntradas)}</strong>
                </span>
                <span>
                  Despesas: <strong className="valor--negativo">{formatoMoeda.format(resumoPessoa.totalSaidas)}</strong>
                </span>
                <span>
                  Saldo:{" "}
                  <strong className={resumoPessoa.saldo >= 0 ? "valor--positivo" : "valor--negativo"}>
                    {formatoMoeda.format(resumoPessoa.saldo)}
                  </strong>
                </span>
              </div>
            )}

            {transacoesDaPessoa.length === 0 ? (
              <p className="vazio">Essa pessoa ainda não tem transações lançadas.</p>
            ) : (
              <div className="tabela-wrapper">
                <table className="tabela">
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Descrição</th>
                      <th>Tipo</th>
                      <th className="tabela__valor">Valor</th>
                      <th aria-label="Ações" />
                    </tr>
                  </thead>
                  <tbody>
                    {transacoesDaPessoa.map((t) => (
                      <tr key={t.id} className={t.tipo === 0 ? "linha--receita" : "linha--despesa"}>
                        <td>{new Date(t.data).toLocaleDateString("pt-BR")}</td>
                        <td>{t.descricao}</td>
                        <td>{t.tipo === 0 ? "Receita" : "Despesa"}</td>
                        <td className="tabela__valor tabela__valor--mono">
                          {t.tipo === 0 ? "+" : "-"}
                          {formatoMoeda.format(t.valor)}
                        </td>
                        <td className="tabela__acoes">
                          <button
                            className="btn btn--pequeno"
                            onClick={() => setTransacaoEmEdicao(t)}
                          >
                            Editar
                          </button>
                          <button
                            className="btn btn--pequeno btn--perigo"
                            onClick={() => handleRemover(t.id)}
                          >
                            Remover
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
