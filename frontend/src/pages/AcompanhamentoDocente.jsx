import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AcompanhamentoDocente.css';

// Mock base de alunos
export const mockAlunosBase = [
    {
        id: 'a001',
        nome: 'João Pereira',
        matricula: '20230021',
        curso: 'Odemologia',
        periodo: '5º',
        status: 'Em acompanhamento'
    },
    {
        id: 'a002',
        nome: 'Ana Santos',
        matricula: '20230022',
        curso: 'Odemologia',
        periodo: '4º',
        status: 'Concluído'
    }
];

// Agora mapeia para arrays de pacientes
const alunoParaPacientesMap = {
    'a001': ['RENAN SANTANA', 'RENAN'], // João tem 2 pacientes
    'a002': ['RENAN LUIS JOAB BYANCA DOS SANTOS'] // Ana tem 1 paciente
};

function AcompanhamentoDocente() {
    const navigate = useNavigate();
    const [alunos, setAlunos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('access_token') || localStorage.getItem('token'));
    const displayName = "LAVOISIER OLIVEIRA CÂNDIDO";

    useEffect(() => {
        async function fetchAndAssignPacientes() {
            try {
                setLoading(true);
                setError(null);

                if (!token) {
                    throw new Error('Token de autenticação não encontrado. Faça login novamente.');
                }

                const response = await fetch(
                    "https://api.tisaude.com/api/patients",
                    {
                        headers: { 
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (!response.ok) {
                    if (response.status === 401) {
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('token');
                        setToken(null);
                        throw new Error('Sessão expirada. Faça login novamente.');
                    }
                    throw new Error(`Erro ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                const pacientesApi = data.data || [];

                const alunosAtualizados = mockAlunosBase.map(aluno => {
                    const nomesPacientes = alunoParaPacientesMap[aluno.id] || [];
                    
                    // 1. Filtra os pacientes que estão no mapeamento
                    const pacientesFiltrados = pacientesApi.filter(p => {
                        const nomePaciente = p.name?.trim().toUpperCase();
                        return nomesPacientes.includes(nomePaciente);
                    });
                
                    // 2. Mapeia para o formato desejado
                    const pacientes = pacientesFiltrados.map(p => ({
                        id: p.id,
                        nome: p.name
                    }));
                
                    return {
                        ...aluno,
                        pacientes // Agora é um array
                    };
                });

                setAlunos(alunosAtualizados);
            } catch (err) {
                console.error('Erro:', err);
                setError(err.message);
                setAlunos(mockAlunosBase.map(aluno => ({
                    ...aluno,
                    pacientes: [] // Fallback com array vazio
                })));
            } finally {
                setLoading(false);
            }
        }

        if (token) {
            fetchAndAssignPacientes();
        } else {
            setError('Usuário não autenticado. Redirecionando para login...');
            setTimeout(() => navigate('/login'), 2000);
        }
    }, [token, navigate]);

    if (loading) return <div className="loading">Carregando dados...</div>;
    if (error) return <div className="error">Erro: {error}</div>;

    return (
        <div className="acompanhamento-container">
            <header className="header">
                <h1>Acompanhamento do Docente</h1>
                <p>Bem-vindo(a), <strong>{displayName}</strong></p>
            </header>

            <div className="alunos-list">
                {alunos.map((aluno) => (
                    <div 
                        key={aluno.id} 
                        className="aluno-card" 
                        onClick={() => navigate(`/aluno/${aluno.id}`, { state: { aluno } })}
                    >
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
                            <p><span className="info-label">Pacientes:</span> 
                                {aluno.pacientes?.length > 0 
                                    ? aluno.pacientes.map(p => p.nome).join(', ') 
                                    : 'Nenhum paciente associado'}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AcompanhamentoDocente;