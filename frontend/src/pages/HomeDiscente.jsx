import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomeDiscente.css'; // Importa o arquivo CSS para estilização

function HomeDiscente() {
  const navigate = useNavigate();
  const displayName = (typeof window !== 'undefined' && (localStorage.getItem('displayName') || localStorage.getItem('username'))) || 'Discente';

  const handleAcompanhamentoClick = () => {
  navigate('/acompanhamento-estudante');
  };

const handlePacientesClick = () => {
  const username = localStorage.getItem('username');
  navigate(`/pacientesDiscente?role=discente&user=${encodeURIComponent(username)}`);
};


  return (
    <div className="home-discente-container">
      {/* Banner/Cartão de boas-vindas */}
      <div className="welcome-card">
        {/* Removido logotipo */}
        <div className="welcome-texts">
          <p className="welcome-title">
            Seja bem-vindo(a), <strong>{displayName}</strong>!
          </p>
          <p className="welcome-description">
            Você está na <span className="accent">Clínica de Radiologia Odontológica</span>. Tenha um ótimo dia de estudo!
          </p>
        </div>
      </div>

      <main className="home-discente-main">
        <p className="home-discente-subtitle">O que você gostaria de fazer hoje?</p>

        {/* Cards de ação (botões) */}
        <div className="home-discente-buttons">
          <button className="discente-button action-card" onClick={handleAcompanhamentoClick}>
            <span className="action-icon" aria-hidden="true" />
            <div className="action-texts">
              <span className="text-module">Acompanhamento</span>
              <span className="text-page">Monitore o seu progresso</span>
            </div>
          </button>

          <button className="discente-button action-card" onClick={handlePacientesClick}>
            <span className="action-icon" aria-hidden="true" />
            <div className="action-texts">
              <span className="text-module">Pacientes</span>
              <span className="text-page">Acesse informações dos pacientes</span>
            </div>
          </button>
        </div>
      </main>
    </div>
  );
}

export default HomeDiscente;