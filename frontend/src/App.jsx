import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import HomeDiscente from "./pages/HomeDiscente";
import AcompanhamentoEstudante from "./pages/AcompanhamentoEstudante";
import Pacientes from "./pages/Pacientes";
import Prontuarios from "./pages/Prontuarios";
import Prontuario from "./pages/Prontuario";
import AcompanhamentoDocente from "./pages/AcompanhamentoDocente";
import DetalhesAluno from "./pages/DetalhesAluno";

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota principal renderizando AcompanhamentoDocente */}
        <Route path="/" element={<AcompanhamentoDocente />} />
        <Route path="/aluno/:id" element={<DetalhesAluno />} /> 
        
        {/* Fallback para rotas desconhecidas */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;