import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AcompanhamentoDocente.css'; // Importação do CSS

export const mockAlunos = [
    {
        id: 'a001',
        nome: 'João Pereira',
        matricula: '20230021',
        curso: 'Odemologia',
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
        matricula: '20230022',
        curso: 'Odemologia',
        periodo: '4º',
        status: 'Concluído',
        pacientes: [
            // ... dados dos pacientes
        ]
    }
];

function AcompanhamentoDocente() {
    const navigate = useNavigate();
    const displayName = "LAVOISIER OLIVEIRA CÂNDIDO"; // Exemplo fixo para combinar com a imagem

    return (
        <div className="acompanhamento-container">
            <header className="header">
                <h1>Acompanhamento do Docente</h1>
            </header>

            <div className="alunos-list">
                {mockAlunos.map((aluno) => (
                    <div key={aluno.id} className="aluno-card" onClick={() => navigate(`/aluno/${aluno.id}`)}>
                        <h2>{aluno.nome}</h2>
                        <div className="aluno-info">
                            <p><span className="info-label">Matrícula:</span> {aluno.matricula}</p>
                            <p><span className="info-label">Curso:</span> {aluno.curso}</p>
                            <p><span className="info-label">Período:</span> {aluno.periodo}</p>
                            <p><span className="info-label">Status:</span> 
                                <span className={`status ${aluno.status.toLowerCase().replace(' ', '-')}`}>
                                    {aluno.status}
                                </span>
                            </p>
                            <p><span className="info-label">Pacientes:</span> {aluno.pacientes.length}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AcompanhamentoDocente;