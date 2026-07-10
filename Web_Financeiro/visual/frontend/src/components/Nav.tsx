import { NavLink } from "react-router-dom";

export default function Nav() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "nav-link nav-link--active" : "nav-link";

  return (
    <header className="app-header">
      <div className="app-header__brand">
        <span className="app-header__mark">CG</span>
        <div>
          <h1>Controle de Gastos</h1>
          <p>livro-caixa pessoal</p>
        </div>
      </div>
      <nav className="app-nav">
        <NavLink to="/Pessoas" className={linkClass}>
          Pessoas
        </NavLink>
        <NavLink to="/transacoes" className={linkClass}>
          Transações
        </NavLink>
        <NavLink to="/totais" className={linkClass}>
          Totais
        </NavLink>
      </nav>
    </header>
  );
}
