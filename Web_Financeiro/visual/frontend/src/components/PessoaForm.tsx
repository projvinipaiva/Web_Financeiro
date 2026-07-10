import { useEffect, useState } from "react";
import type { Pessoas, PessoaInput } from "../types";

interface PessoaFormProps {
  pessoaEmEdicao: Pessoas | null;
  onSalvar: (dados: PessoaInput) => Promise<void>;
  onCancelar: () => void;
}

const valoresIniciais: PessoaInput = { nome: "", idade: undefined };

export default function PessoaForm({
  pessoaEmEdicao,
  onSalvar,
  onCancelar,
}: PessoaFormProps) {
  const [dados, setDados] = useState<PessoaInput>(valoresIniciais);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    setDados(
      pessoaEmEdicao
        ? { nome: pessoaEmEdicao.nome, idade: pessoaEmEdicao.idade }
        : valoresIniciais
    );
    setErro(null);
  }, [pessoaEmEdicao]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dados.nome.trim()) {
      setErro("Informe um nome.");
      return;
    }
    setErro(null);
    setEnviando(true);
    try {
      await onSalvar(dados);
      setDados(valoresIniciais);
    } catch {
      setErro("Não foi possível salvar. Confira o backend e tente de novo.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h3>{pessoaEmEdicao ? "Editar pessoa" : "Nova pessoa"}</h3>

      <label className="field">
        <span>Nome</span>
        <input
          type="text"
          value={dados.nome}
          onChange={(e) => setDados({ ...dados, nome: e.target.value })}
          placeholder="Ex: Vinícius"
          autoFocus
        />
      </label>

      <label className="field">
        <span>Idade (opcional)</span>
        <input
          type="number"
          min={0}
          max={130}
          value={dados.idade ?? ""}
          onChange={(e) =>
            setDados({
              ...dados,
              idade: e.target.value === "" ? undefined : Number(e.target.value),
            })
          }
          placeholder="Ex: 25"
        />
      </label>

      {erro && <p className="form__erro">{erro}</p>}

      <div className="form__acoes">
        <button type="submit" className="btn btn--primario" disabled={enviando}>
          {enviando ? "Salvando..." : pessoaEmEdicao ? "Salvar alterações" : "Adicionar"}
        </button>
        {pessoaEmEdicao && (
          <button type="button" className="btn" onClick={onCancelar}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
