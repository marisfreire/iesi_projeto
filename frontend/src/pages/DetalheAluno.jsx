import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './DetalheAluno.css';

function DetalhesAluno() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  
  const aluno = state?.aluno;

  if (!aluno) {
    return (
      <div className="aluno-nao-encontrado">
        <h2>Aluno não encontrado</h2>
        <button 
          className="button-voltar"
          onClick={() => navigate(-1)}
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="detalhes-aluno-container">
      <header className="aluno-header">
        <h1>{aluno.nome}</h1>
        <div className="aluno-info-grid">
          <p><strong>Matrícula:</strong> {aluno.matricula}</p>
          <p><strong>Curso:</strong> {aluno.curso}</p>
          <p><strong>Período:</strong> {aluno.periodo}</p>
          <p><strong>Status:</strong> 
            <span className={`status-badge status-${aluno.status.toLowerCase().replace(' ', '-')}`}>
              {aluno.status}
            </span>
          </p>
        </div>
      </header>

      <section className="pacientes-section">
        <h2>Pacientes em Acompanhamento</h2>
        
        {aluno.pacientes?.length > 0 ? (
          <div className="pacientes-grid">
            {aluno.pacientes.map(paciente => (
              <div 
                key={paciente.id} 
                className="paciente-card"
                onClick={() => navigate(`/prontuario/${paciente.id}`, { 
                  state: { paciente } 
                })}
              >
                <h3>{paciente.nome}</h3>
                <button 
                  className="ver-prontuario-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/prontuario/${paciente.id}`, {
                      state: { paciente }
                    });
                  }}
                >
                  Ver Prontuário
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="sem-pacientes">Nenhum paciente em acompanhamento</p>
        )}
      </section>

      <button 
        className="button-voltar"
        onClick={() => navigate(-1)}
      >
        Voltar para Acompanhamento
      </button>
    </div>
  );
}

export default DetalhesAluno;