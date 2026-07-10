import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Nav from "./components/Nav";
import Pessoas from "./pages/Pessoas";
import Transacoes from "./pages/Transacoes";
import Totais from "./pages/Totais";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Nav />
        <main className="app__conteudo">
          <Routes>
            <Route path="/" element={<Navigate to="/Pessoas" replace />} />
            <Route path="/Pessoas" element={<Pessoas />} />
            <Route path="/transacoes" element={<Transacoes />} />
            <Route path="/totais" element={<Totais />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
