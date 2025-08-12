import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AcompanhamentoDocente.css';
import { mockAlunos } from '../data/alunos';

function AcompanhamentoDocente() {
    const navigate = useNavigate();

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