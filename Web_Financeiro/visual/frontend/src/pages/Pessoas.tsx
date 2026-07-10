import { useEffect, useState } from "react";
import { PessoasAPI } from "../services/api";
import type { Pessoas, PessoaInput } from "../types";
import PessoaForm from "../components/PessoaForm";

export default function Pessoas() {
  const [pessoas, setPessoas] = useState<Pessoas[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [pessoaEmEdicao, setPessoaEmEdicao] = useState<Pessoas | null>(null);

  const carregar = async () => {
    setCarregando(true);
    setErro(null);
    try {
      const lista = await PessoasAPI.listar();
      setPessoas(lista);
    } catch {
      setErro("Não foi possível carregar as pessoas. Verifique se o backend está rodando.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const handleSalvar = async (dados: PessoaInput) => {
    if (pessoaEmEdicao) {
      await PessoasAPI.atualizar(pessoaEmEdicao.id, dados);
      setPessoaEmEdicao(null);
    } else {
      await PessoasAPI.criar(dados);
    }
    await carregar();
  };

  const handleRemover = async (id: number) => {
    if (!confirm("Remover esta pessoa? As transações vinculadas também podem ser afetadas.")) {
      return;
    }
    try {
      await PessoasAPI.remover(id);
      await carregar();
    } catch {
      setErro("Não foi possível remover. Ela pode ter transações vinculadas.");
    }
  };

  return (
    <section className="pagina">
      <div className="pagina__cabecalho">
        <h2>Pessoas</h2>
        <p>Cadastre quem participa do controle de gastos.</p>
      </div>

      <div className="pagina__grid">
        <PessoaForm
          pessoaEmEdicao={pessoaEmEdicao}
          onSalvar={handleSalvar}
          onCancelar={() => setPessoaEmEdicao(null)}
        />

        <div className="card">
          {erro && <p className="form__erro">{erro}</p>}
          {carregando ? (
            <p className="vazio">Carregando...</p>
          ) : pessoas.length === 0 ? (
            <p className="vazio">Nenhuma pessoa cadastrada ainda.</p>
          ) : (
            <div className="tabela-wrapper">
              <table className="tabela">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Idade</th>
                    <th aria-label="Ações" />
                  </tr>
                </thead>
                <tbody>
                  {pessoas.map((p) => (
                    <tr key={p.id}>
                      <td>{p.nome}</td>
                      <td>{p.idade ?? "—"}</td>
                      <td className="tabela__acoes">
                        <button className="btn btn--pequeno" onClick={() => setPessoaEmEdicao(p)}>
                          Editar
                        </button>
                        <button
                          className="btn btn--pequeno btn--perigo"
                          onClick={() => handleRemover(p.id)}
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
        </div>
      </div>
    </section>
  );
}
