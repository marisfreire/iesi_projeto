import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './DetalheAluno.css'; // Arquivo de estilos que vamos criar

// Mock dos dados (deve ser o mesmo usado no AcompanhamentoDocente)
import { mockAlunos } from './AcompanhamentoDocente';

function DetalhesAluno() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Encontra o aluno pelo ID
  const aluno = mockAlunos.find(aluno => aluno.id === id);
  
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
      {/* Cabeçalho com dados do aluno */}
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

      {/* Seção de pacientes */}
      <section className="pacientes-section">
        <h2>Pacientes em Acompanhamento</h2>
        
        {aluno.pacientes.length > 0 ? (
          <div className="pacientes-grid">
            {aluno.pacientes.map(paciente => (
              <div key={paciente.id} className="paciente-card">
                <h3>{paciente.nome}</h3>
                <div className="paciente-info">
                  <p><strong>Idade:</strong> {paciente.idade} anos</p>
                  <p><strong>Diagnóstico:</strong> {paciente.diagnostico}</p>
                  <p><strong>Última consulta:</strong> {paciente.ultimaConsulta}</p>
                  <p><strong>Próxima consulta:</strong> {paciente.proximaConsulta}</p>
                  <p><strong>Observações:</strong> {paciente.observacoes}</p>
                </div>
                <button 
                  className="ver-prontuario-btn"
                  onClick={() => navigate(`/prontuario/${paciente.id}`)}
                >
                  Ver Prontuário Completo
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