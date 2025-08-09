import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './DetalhesAluno.css'; // Arquivo de estilos (criar depois)

// Mock de dados - substitua por sua API real
const mockAlunos = [
  {
    id: 'a001',
    nome: 'João Pereira',
    matricula: '20230001',
    curso: 'Odontologia',
    periodo: '5º',
    status: 'Em acompanhamento',
    pacientes: [
      {
        id: 'p001',
        nome: 'Maria Silva',
        idade: 45,
        diagnostico: 'Cárie severa',
        ultimaConsulta: '15/03/2023',
        proximaConsulta: '12/04/2023'
      },
      {
        id: 'p002',
        nome: 'Carlos Oliveira',
        idade: 32,
        diagnostico: 'Gengivite',
        ultimaConsulta: '20/03/2023',
        proximaConsulta: '17/04/2023'
      }
    ]
  },
  {
    id: 'a002',
    nome: 'Ana Santos',
    matricula: '20230002',
    curso: 'Odontologia',
    periodo: '4º',
    status: 'Concluído',
    pacientes: [
      {
        id: 'p003',
        nome: 'Roberto Almeida',
        idade: 28,
        diagnostico: 'Ortodontia',
        ultimaConsulta: '10/03/2023',
        proximaConsulta: '07/04/2023'
      }
    ]
  }
];

function DetalhesAluno() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Encontra o aluno pelo ID
  const aluno = mockAlunos.find(aluno => aluno.id === id);
  
  if (!aluno) {
    return (
      <div className="aluno-nao-encontrado">
        <h2>Aluno não encontrado</h2>
        <button onClick={() => navigate(-1)}>Voltar</button>
      </div>
    );
  }

  return (
    <div className="detalhes-aluno-container">
      {/* Cabeçalho com dados do aluno */}
      <header className="aluno-header">
        <h1>{aluno.nome}</h1>
        <div className="aluno-info">
          <p><strong>Matrícula:</strong> {aluno.matricula}</p>
          <p><strong>Curso:</strong> {aluno.curso}</p>
          <p><strong>Período:</strong> {aluno.periodo}</p>
          <p><strong>Status:</strong> {aluno.status}</p>
        </div>
      </header>

      {/* Seção de pacientes acompanhados */}
      <section className="pacientes-section">
        <h2>Pacientes em Acompanhamento</h2>
        
        {aluno.pacientes.length > 0 ? (
          <div className="pacientes-list">
            {aluno.pacientes.map(paciente => (
              <div key={paciente.id} className="paciente-card">
                <h3>{paciente.nome}</h3>
                <p><strong>Idade:</strong> {paciente.idade} anos</p>
                <p><strong>Diagnóstico:</strong> {paciente.diagnostico}</p>
                <p><strong>Última consulta:</strong> {paciente.ultimaConsulta}</p>
                <p><strong>Próxima consulta:</strong> {paciente.proximaConsulta}</p>
                <button 
                  onClick={() => navigate(`/prontuario/${paciente.id}`)}
                  className="ver-prontuario-btn"
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

      <button onClick={() => navigate(-1)} className="voltar-btn">
        Voltar
      </button>
    </div>
  );
}

export default DetalhesAluno;