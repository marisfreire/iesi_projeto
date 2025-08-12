import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomeDocente.css";

export default function HomeDocente() {
  const navigate = useNavigate();

  const handleAcompanhamentoClick = () => {
    navigate("/acompanhamento-docente");
  };

  const handleAgendamentoClick = () => {
    navigate("/agendamento");
  };

  {/*const handleCalendarioClick = () => {
    navigate("/calendario");
  };*/}

  return (
    <div className="home-page-container">
      <div className="header-background">
        <h1 className="header-title">
          Sistema de Gestão <br /> Clínica-Escola de Odontologia
        </h1>
        <p className="header-subtitle">
          Gerencie pacientes, agendamentos e acompanhamento de estudantes.
        </p>
      </div>
      <div className="card-container">
        <div className="card">
          <div className="card-icon">
            <img src="/icons/calendar.png" alt="Ícone de Calendário" />
          </div>
          <h3 className="card-title">Calendário</h3>
          <p className="card-description">Gerencie todos os agendamentos em um calendário.</p>
        </div>
        <button 
          className="card card-button" 
          onClick={handleAgendamentoClick}
        >
           <div className="card-icon">
            <img src="/icons/schedule.png" alt="Ícone de Agendamento" />
          </div>
          <h3 className="card-title">Agendamento</h3>
          <p className="card-description">Crie novos agendamentos e consultas.</p>
        </button>
        <div className="card">
          <div className="card-icon">
            <img src="/icons/patients.png" alt="Ícone de Pacientes" />
          </div>
          <h3 className="card-title">Pacientes</h3>
          <p className="card-description">Acesse informações e histórico de todos os seus pacientes.</p>
        </div>
        {/* Card de Acompanhamento como botão clicável */}
        <button 
          className="card card-button" 
          onClick={handleAcompanhamentoClick}
        >
          <div className="card-icon">
            <img src="/icons/student.png" alt="Ícone de Acompanhamento" />
          </div>
          <h3 className="card-title">Acompanhamento</h3>
          <p className="card-description">Monitore o progresso e desenvolvimento dos estudantes na clínica.</p>
        </button>
      </div>
    </div>
  );
}