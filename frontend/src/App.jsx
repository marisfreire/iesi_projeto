import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import HomeDiscente from "./pages/HomeDiscente";
import HomeDocentePage from "./pages/HomeDocentePage";
import AcompanhamentoEstudante from "./pages/AcompanhamentoEstudante";
import Pacientes from "./pages/Pacientes";
import Prontuarios from "./pages/Prontuarios";
import Prontuario from "./pages/Prontuario";
import Agendamento from "./components/AgendamentoForm";
import AcompanhamentoDocente from "./pages/AcompanhamentoDocente";
import DetalhesAluno from "./pages/DetalheAluno";
import InfoPaciente from "./pages/InfoPaciente";
import PacientesDiscente from "./pages/PacientesDiscente";

function App() {
  return (
    <Router>
      <Routes>
  <Route path="/" element={<Login />} />
  <Route path="/agendamento" element={<Agendamento />} />
  <Route path="/discente" element={<HomeDiscente />} />
  <Route path="/docente" element={<HomeDocentePage />} />
  <Route path="/acompanhamento-estudante" element={<AcompanhamentoEstudante />} />
  <Route path="/acompanhamento-docente/" element={<AcompanhamentoDocente />} />
  <Route path="/aluno/:id" element={<DetalhesAluno />} />
  <Route path="/pacientes" element={<Pacientes />} />
  <Route path="/prontuarios" element={<Prontuarios />} />
  <Route path="/infopaciente/:id" element={<InfoPaciente />} />
  <Route path="/pacientesdiscente" element={<PacientesDiscente />} />
  <Route path="/prontuario/:id" element={<Prontuario />} />
   <Route path="/calendario" element={<Calendario />} />
        {/* Fallback para rotas desconhecidas */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;