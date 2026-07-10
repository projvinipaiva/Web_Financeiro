import { useEffect, useState } from "react";
import { TransacoesAPI } from "../services/api";
import type { Total } from "../types";

const formatoMoeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export default function Total() {
  const [Total, setTotal] = useState<Total>();
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const carregar = async () => {
      setCarregando(true);
      setErro(null);
      try {
        const total = await TransacoesAPI.total()
        setTotal(total);
      } catch {
        setErro("Não foi possível calcular os Total. Verifique se o backend está rodando.");
      } finally {
        setCarregando(false);
      }
    };
    carregar();
  }, []);


  return (
    <section className="pagina">
      <div className="pagina__cabecalho">
        <h2>Total</h2>
        <p>Saldo consolidado de Receita e Despensa por pessoa.</p>
      </div>

      {erro && <p className="form__erro">{erro}</p>}

      {carregando ? (
        <p className="vazio">Calculando...</p>
      ) : Total?.pessoas.length === 0 ? (
        <p className="vazio">Cadastre pessoas e transações para ver os Total.</p>
      ) : (
        <>
          <div className="totais__grid">
            {Total?.pessoas.map((t) => (
              <div key={t.pessoa} className="card totais__card">
                <h3>{t.pessoa}</h3>
                <dl>
                  <div className="totais__linha">
                    <dt>Receitas</dt>
                    <dd className="valor--positivo">
                      {formatoMoeda.format(t.totalReceitas)}
                    </dd>
                  </div>
                  <div className="totais__linha">
                    <dt>Despesas</dt>
                    <dd className="valor--negativo">
                      {formatoMoeda.format(t.totalDespesas)}
                    </dd>
                  </div>
                  <div className="totais__linha totais__linha--saldo">
                    <dt>Saldo</dt>
                    <dd className={t.saldo >= 0 ? "valor--positivo" : "valor--negativo"}>
                      {formatoMoeda.format(t.saldo)}
                    </dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>

          <div className="card totais__resumo">
            <span>Saldo geral</span>
            <strong className={Total!.saldoLiquido! >= 0 ? "valor--positivo" : "valor--negativo"}>
              {formatoMoeda.format(Total?.saldoLiquido!)}
            </strong>
          </div>
        </>
      )}
    </section>
  );
}
