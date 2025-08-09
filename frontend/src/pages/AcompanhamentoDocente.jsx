import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AcompanhamentoDocente.css';

export const mockAlunos = [
    {
      id: 'a001',
      nome: 'João Pereira',
      matricula: '20230001',
      curso: 'Odontologia',
      periodo: '5º',
      status: 'Em acompanhamento',
      pacientes: [
        {
          id: 1,
          nome: 'João Silva',
          idade: 10,
          diagnostico: 'TDAH',
          observacoes: 'Precisa de acompanhamento semanal.',
          ultimaConsulta: '10/03/2023',
          proximaConsulta: '07/04/2023',
          responsaveis: ['docente1']
        },
        {
          id: 2,
          nome: 'Maria Oliveira',
          idade: 12,
          diagnostico: 'Dislexia',
          observacoes: 'Melhora significativa nas últimas semanas.',
          ultimaConsulta: '15/03/2023',
          proximaConsulta: '12/04/2023',
          responsaveis: ['docente1', 'docente2']
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
          id: 3,
          nome: 'Pedro Santos',
          idade: 11,
          diagnostico: 'Autismo',
          observacoes: 'Necessita de suporte adicional em sala.',
          ultimaConsulta: '20/03/2023',
          proximaConsulta: '17/04/2023',
          responsaveis: ['docente2']
        }
      ]
    }
  ];
const pacientes = mockAlunos;

function AcompanhamentoDocente() {
    const navigate = useNavigate();
    const displayName = (typeof window !== 'undefined' && (localStorage.getItem('displayName') || localStorage.getItem('username'))) || 'Docente';
    const username = localStorage.getItem('username');
    const alunos = pacientes;

    const handleAlunoClick = (alunoId) => {
        // Navega para a página de detalhes do aluno com o ID como parâmetro
        navigate(`/aluno/${alunoId}`);
    };

    return (
        <div className="acompanhamento-docente-container">
            <header className="acompanhamento-docente-header">
                <h2>Acompanhamento do Docente</h2>
                <p>Bem-vindo(a), <strong>{displayName}</strong>!</p>
            </header>

            <div className="alunos-list">
                {alunos.length > 0 ? (
                    alunos.map((aluno) => (
                        <button 
                          key={aluno.id} 
                          className="aluno-card"
                          onClick={() => handleAlunoClick(aluno.id)}
                        >
                          <div className="aluno-card-block">
                            <h4>{aluno.nome}</h4>
                            <p><strong>Matrícula:</strong> {aluno.matricula}</p>
                            <p><strong>Curso:</strong> {aluno.curso}</p>
                            <p><strong>Período:</strong> {aluno.periodo}</p>
                            <p><strong>Status:</strong> {aluno.status}</p>
                            <p><strong>Pacientes:</strong> {aluno.pacientes.length}</p>
                          </div>
                        </button>
                      ))
                ) : (
                    <p>Nenhum aluno encontrado para acompanhamento.</p>
                )}
            </div>
        </div>
    );
}

export default AcompanhamentoDocente;