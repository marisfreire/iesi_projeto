import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './DetalheAluno.css'; // Arquivo de estilos que vamos criar

// Mock dos dados (deve ser o mesmo usado no AcompanhamentoDocente)
import { mockAlunos } from './AcompanhamentoDocente';

function DetalhesAluno() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [pacientesAPI, setPacientesAPI] = useState([]);
  const [loadingPac, setLoadingPac] = useState(true);
  const [errorPac, setErrorPac] = useState(null);
  
  // Encontra o aluno pelo ID (somente para dados do aluno no cabeçalho)
  const aluno = mockAlunos.find(aluno => aluno.id === id);

  // Busca 2 pacientes reais (IDs 370 e 359) da API
  useEffect(() => {
    let cancelled = false;
    async function fetchPacientesReais() {
      try {
        setLoadingPac(true);
        setErrorPac(null);
        const token = localStorage.getItem('access_token');
        const ids = [370, 359];
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const resps = await Promise.all(
          ids.map((pid) => fetch(`https://api.tisaude.com/api/patients/${pid}`, { headers }))
        );
        const ok = await Promise.all(
          resps.map(async (r) => (r.ok ? await r.json() : null))
        );
        const items = ok.filter(Boolean);
        if (!cancelled) setPacientesAPI(items);
      } catch (e) {
        if (!cancelled) setErrorPac(e.message);
      } finally {
        if (!cancelled) setLoadingPac(false);
      }
    }
    fetchPacientesReais();
    return () => { cancelled = true; };
  }, []);
  
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

      {/* Seção de pacientes (dados reais) */}
      <section className="pacientes-section">
        <h2>Pacientes em Acompanhamento</h2>

        {loadingPac && <p className="sem-pacientes">Carregando pacientes…</p>}
        {errorPac && !loadingPac && (
          <p className="sem-pacientes">Erro ao carregar pacientes: {errorPac}</p>
        )}

        {!loadingPac && !errorPac && pacientesAPI.length === 0 && (
          <p className="sem-pacientes">Nenhum paciente encontrado.</p>
        )}

        {!loadingPac && !errorPac && pacientesAPI.length > 0 && (
          <div className="pacientes-grid">
            {pacientesAPI.map((paciente) => (
              <div key={paciente.id} className="paciente-card">
                <h3>{paciente.name || `Paciente #${paciente.id}`}</h3>
                <div className="paciente-info">
                  <p><strong>ID:</strong> {paciente.id}</p>
                  <p><strong>Convênio:</strong> {paciente.healthInsurance?.name || 'N/A'}</p>
                  <p><strong>Status:</strong> {paciente.status?.status || 'N/A'}</p>
                </div>
                <button
                  className="ver-prontuario-btn"
                  onClick={() => {
                    const search = location.search || '';
                    navigate(`/prontuario/${paciente.id}${search}`);
                  }}
                >
                  Ver Prontuário Completo
                </button>
              </div>
            ))}
          </div>
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