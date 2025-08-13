import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomeDocente.css";

export default function HomeDocente() {
  const navigate = useNavigate();
  const displayName = (typeof window !== 'undefined' && (localStorage.getItem('displayName') || localStorage.getItem('username'))) || 'Docente';

  const handleAcompanhamentoClick = () => {
    navigate("/acompanhamento-docente");
  };

  const handleAgendamentoClick = () => {
    navigate("/agendamento");
  };

  const handleCalendarioClick = () => {
    navigate("/calendario");
  };

  const handlePacientesClick = () => {
    navigate("/pacientes");
  };

  return (
    <div className="home-docente-container">
      {/* Banner de boas-vindas */}
      <div className="welcome-card-docente">
        <div className="welcome-texts-docente">
          <p className="welcome-title-docente">
            Seja bem-vindo(a), <strong>{displayName}</strong>!
          </p>
          <p className="welcome-description-docente">
            Você está na <span className="accent-docente">Clínica-Escola de Odontologia</span>. Tenha um ótimo dia de trabalho!
          </p>
        </div>
      </div>

      {/* NOVO: Container principal dos cards com fundo branco */}
      <div className="main-card-container">
        <p className="home-docente-subtitle">Gerencie pacientes, agendamentos e acompanhamento de estudantes.</p>

        <div className="home-docente-buttons">
          {/* Cartões de Ação para Docente */}
          <button className="docente-button" onClick={handleCalendarioClick}>
            <span className="action-icon-docente" aria-hidden="true" />
            <div className="action-texts-docente">
              <span className="text-module-docente">Calendário</span>
              <span className="text-page-docente">Gerencie todos os agendamentos</span>
            </div>
          </button>

          <button className="docente-button" onClick={handleAgendamentoClick}>
            <span className="action-icon-docente" aria-hidden="true" />
            <div className="action-texts-docente">
              <span className="text-module-docente">Agendamento</span>
              <span className="text-page-docente">Crie novos agendamentos e consultas</span>
            </div>
          </button>

          <button className="docente-button" onClick={handlePacientesClick}>
            <span className="action-icon-docente" aria-hidden="true" />
            <div className="action-texts-docente">
              <span className="text-module-docente">Pacientes</span>
              <span className="text-page-docente">Acesse informações de todos os pacientes</span>
            </div>
          </button>

          <button className="docente-button" onClick={handleAcompanhamentoClick}>
            <span className="action-icon-docente" aria-hidden="true" />
            <div className="action-texts-docente">
              <span className="text-module-docente">Acompanhamento</span>
              <span className="text-page-docente">Monitore o progresso dos estudantes</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}