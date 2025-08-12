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

const alunoParaPacienteMap = {
    'a001': 'RENAN SANTANA',
    'a002': 'RENAN LUIS JOAB BYANCA DOS SANTOS'
};

function AcompanhamentoDocente() {
    const navigate = useNavigate();
    const [alunos, setAlunos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('access_token') || localStorage.getItem('token'));
    const displayName = "LAVOISIER OLIVEIRA CÂNDIDO";

    // Log inicial do token
    console.log('Token inicial:', token);
    console.log('LocalStorage completo:', localStorage);

    useEffect(() => {
        console.log('useEffect iniciado - Token atual:', token);
        
        async function fetchAndAssignPacientes() {
            try {
                console.log('Iniciando fetchAndAssignPacientes');
                setLoading(true);
                setError(null);

                // Verifica se o token existe
                if (!token) {
                    console.warn('Token não encontrado no localStorage');
                    throw new Error('Token de autenticação não encontrado. Faça login novamente.');
                }

                console.log('Preparando requisição com token:', token);
                const response = await fetch(
                    "https://api.tisaude.com/api/patients",
                    {
                        headers: { 
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                console.log('Resposta da API recebida. Status:', response.status);
                
                if (!response.ok) {
                    if (response.status === 401) {
                        console.warn('Erro 401 - Token inválido ou expirado');
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('token');
                        setToken(null);
                        throw new Error('Sessão expirada. Faça login novamente.');
                    }
                    throw new Error(`Erro ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                console.log('Dados recebidos da API:', data);
                const pacientesApi = data.data || [];
                console.log('Pacientes da API:', pacientesApi);

                const alunosAtualizados = mockAlunosBase.map(aluno => {
                    const nomePacienteAluno = alunoParaPacienteMap[aluno.id];
                    console.log(`Buscando paciente para ${aluno.nome}: ${nomePacienteAluno}`);
                    
                    const paciente = pacientesApi.find(p => 
                        p.name?.trim().toUpperCase() === nomePacienteAluno?.trim().toUpperCase()
                    );

                    console.log(`Paciente encontrado para ${aluno.nome}:`, paciente);
                    
                    return {
                        ...aluno,
                        paciente: paciente ? { 
                            id: paciente.id, 
                            nome: paciente.name 
                        } : null
                    };
                });

                console.log('Alunos atualizados:', alunosAtualizados);
                setAlunos(alunosAtualizados);
            } catch (err) {
                console.error('Erro capturado:', err);
                setError(err.message);
                setAlunos(mockAlunosBase.map(aluno => ({
                    ...aluno,
                    paciente: null
                })));
            } finally {
                console.log('Finalizando fetchAndAssignPacientes');
                setLoading(false);
            }
        }

        if (token) {
            console.log('Token válido encontrado, iniciando requisição');
            fetchAndAssignPacientes();
        } else {
            console.warn('Nenhum token encontrado, redirecionando para login');
            setError('Usuário não autenticado. Redirecionando para login...');
            setTimeout(() => navigate('/login'), 2000);
        }
    }, [token, navigate]);

    if (loading) {
        console.log('Renderizando estado de loading');
        return <div className="loading">Carregando dados...</div>;
    }
    
    if (error) {
        console.log('Renderizando estado de erro:', error);
        return <div className="error">Erro: {error}</div>;
    }

    console.log('Renderizando conteúdo principal com alunos:', alunos);
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
                            <p><span className="info-label">Paciente:</span> 
                                {aluno.paciente ? aluno.paciente.nome : 'Nenhum paciente associado'}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AcompanhamentoDocente;