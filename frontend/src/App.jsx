import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import HomeDiscente from "./pages/HomeDiscente";
import AcompanhamentoEstudante from "./pages/AcompanhamentoEstudante";
import Pacientes from "./pages/Pacientes";
import Prontuarios from "./pages/Prontuarios";
import Prontuario from "./pages/Prontuario";

function App() {
  return (
    <Router>
      <Routes>
  <Route path="/" element={<Login />} />
  <Route path="/discente" element={<HomeDiscente />} />
  <Route path="/acompanhamento-estudante" element={<AcompanhamentoEstudante />} />
  <Route path="/pacientes" element={<Pacientes />} />
  <Route path="/prontuarios" element={<Prontuarios />} />
  <Route path="/prontuario/:id" element={<Prontuario />} />
        {/* Fallback para rotas desconhecidas */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;