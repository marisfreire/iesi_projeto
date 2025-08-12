import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { pacientes as datasetPacientes } from "../data/pacientes";
import { mockAlunos } from "../data/alunos";
import "./Prontuario.css";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

// Busca paciente tanto no mock do acompanhamento quanto no dataset de pacientes
function usePacienteById(id) {
  return useMemo(() => {
    // 1) tentar achar no mock do acompanhamento (ids numéricos: 1, 2, ...)
    const idNum = Number(id);
    let fromAcompanhamento = null;
    if (!Number.isNaN(idNum)) {
      for (const aluno of mockAlunos) {
        const p = aluno.pacientes.find((pac) => pac.id === idNum);
        if (p) {
          fromAcompanhamento = {
            origem: "acompanhamento",
            id: String(p.id),
            nome: p.nome,
            idade: p.idade,
            diagnostico: p.diagnostico,
            observacoes: p.observacoes,
            ultimaConsulta: p.ultimaConsulta,
            proximaConsulta: p.proximaConsulta,
            responsaveis: p.responsaveis || [],
          };
          break;
        }
      }
    }

    if (fromAcompanhamento) return fromAcompanhamento;

    // 2) fallback para o dataset de pacientes (ids: p001, p002...)
    const p2 = datasetPacientes.find((p) => String(p.id) === String(id));
    if (p2) {
      return {
        origem: "dataset",
        id: String(p2.id),
        nome: p2.nome,
        idade: p2.idade,
        diagnostico: p2.diagnostico,
        observacoes: p2.observacoes,
        responsaveis: p2.responsaveis || [],
      };
    }

    return null;
  }, [id]);
}

export default function Prontuario() {
  const { id } = useParams();
  const query = useQuery();
  const role = query.get("role") || "discente"; // 'docente' edita, 'discente' só vê
  const initialTab = (query.get("tab") || "fichas").toLowerCase();
  const navigate = useNavigate();

  const paciente = usePacienteById(id);
  // estado de "tab" não é mais necessário com acordeão
  const [dados, setDados] = useState({
    diagnostico: paciente?.diagnostico || "",
    observacoes: paciente?.observacoes || "",
  });

  useEffect(() => {
    // Atualiza estado quando muda paciente
    setDados({
      diagnostico: paciente?.diagnostico || "",
      observacoes: paciente?.observacoes || "",
    });
  }, [paciente?.id, paciente?.diagnostico, paciente?.observacoes]);

  // (removido, reinserido após validInitial)

  const somenteLeitura = role !== "docente";

  // Seções do acordeão
  const sectionsDef = [
  { key: "fichas", label: "Fichas" },
  { key: "receituario", label: "Receituário" },
  { key: "exames", label: "Exames" },
  { key: "atestados", label: "Atestados e Declarações" },
  { key: "orientacoes", label: "Orientações" },
  { key: "pareceres", label: "Laudos e Pareceres" },
  { key: "visitasclinicas", label: "Visitas Clínicas" },
  { key: "orcamentos", label: "Orçamentos/Pedidos" },
  ];

  // Seção expandida inicialmente (se ?tab não corresponder a uma seção, usar 'fichas')
  const validInitial = sectionsDef.some((s) => s.key === initialTab) ? initialTab : "fichas";
  const [openSections, setOpenSections] = useState({ [validInitial]: true });

  // Garantir que a URL tenha ?tab=<secao> na inicialização
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (!params.get('tab')) {
      params.set('tab', validInitial);
      navigate({ search: params.toString() }, { replace: true });
    }
  }, [validInitial, navigate]);

  // Mock detalhado por aba para o paciente atual
  const mock = useMemo(() => {
    const hoje = new Date();
    const d = (offset) => new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + offset)
      .toISOString().slice(0, 10);
    const nome = paciente?.nome || "Paciente";

    return {
      receituario: [
        { id: `${paciente?.id}-rx1`, data: d(-10), medicamento: "Paracetamol 750mg", posologia: "1 comp 8/8h por 5 dias" },
        { id: `${paciente?.id}-rx2`, data: d(-3), medicamento: "Ibuprofeno 400mg", posologia: "1 comp 12/12h se dor" },
      ],
      exames: [
        { id: `${paciente?.id}-ex1`, data: d(-20), nome: "Hemograma completo", resultado: "Dentro da normalidade" },
        { id: `${paciente?.id}-ex2`, data: d(-15), nome: "Raio-X", resultado: "Sem alterações" },
      ],
      atestados: [
        { id: `${paciente?.id}-at1`, data: d(-7), tipo: "Atestado Médico", dias: 2 },
      ],
      orientacoes: [
        { id: `${paciente?.id}-or1`, data: d(-5), titulo: "Hidratação", descricao: "Ingerir 2L de água por dia" },
        { id: `${paciente?.id}-or2`, data: d(-2), titulo: "Repouso", descricao: "Evitar esforço físico por 48h" },
      ],
      pareceres: [
        { id: `${paciente?.id}-pa1`, data: d(-12), profissional: "Dr(a). Ramos", texto: `Parecer clínico sobre ${nome}` },
      ],
      visitasclinicas: [
        { id: `${paciente?.id}-vc1`, data: d(-30), local: "Clínica Escola - Sala 2", nota: "Acompanhamento inicial" },
      ],
      orcamentos: [
        { id: `${paciente?.id}-oc1`, data: d(-9), item: "Exame Laboratorial", valor: 120.0, status: "aprovado" },
        { id: `${paciente?.id}-oc2`, data: d(-1), item: "Medicamento", valor: 45.5, status: "pendente" },
      ],
    };
  }, [paciente]);

  // Contadores por aba (mock simples)
  const counts = useMemo(() => {
  const base = {
      fichas: paciente?.diagnostico || paciente?.observacoes ? 1 : 0,
      receituario: mock.receituario.length,
      exames: mock.exames.length,
      atestados: mock.atestados.length,
      orientacoes: mock.orientacoes.length,
      pareceres: mock.pareceres.length,
      visitasclinicas: mock.visitasclinicas.length,
      orcamentos: mock.orcamentos.length,
    };
    // Exemplo: se veio do acompanhamento, assume 1 ficha
    if (paciente?.origem === "acompanhamento") base.fichas = 1;
    return base;
  }, [paciente, mock]);

  if (!paciente) {
    return (
      <div style={{ padding: 24 }}>
        <p>Paciente não encontrado.</p>
        <button onClick={() => navigate(-1)}>Voltar</button>
      </div>
    );
  }

  const salvar = () => {
    // Placeholder: enviar atualização para backend se role === 'docente'
    alert("Prontuário salvo (mock).");
  };

  const mockList = (titulo, items, render) => {
    return (
      <div className="card">
        <h3 style={{ marginTop: 0 }}>{titulo}</h3>
        {items.length === 0 ? (
          <p className="muted">Nenhum registro nesta aba (mock).</p>
        ) : (
          <ul style={{ listStyle: "none", paddingLeft: 0, margin: 0 }}>
            {items.map((it) => (
              <li key={it.id} style={{ padding: "10px 0", borderBottom: "1px solid #eee" }}>
                {render(it)}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  const SectionContent = (key) => {
    switch (key) {
      case "informacoes":
        return (
          <div className="card">
            <h3>Dados Pessoais</h3>
            <div className="info-grid">
              <p><strong>Nome:</strong> {paciente.nome}</p>
              {paciente.idade ? (
                <p><strong>Idade:</strong> {paciente.idade} anos</p>
              ) : null}
              <p><strong>Responsáveis:</strong> {paciente.responsaveis?.join(", ") || "—"}</p>
              <p><strong>Última consulta:</strong> {paciente.ultimaConsulta || "—"}</p>
              <p><strong>Próxima consulta:</strong> {paciente.proximaConsulta || "—"}</p>
              <p><strong>ID:</strong> {paciente.id}</p>
            </div>
          </div>
        );
      case "fichas":
        return (
          <div className="card">
            <h3>Ficha Clínica</h3>
            <div className="form-field">
              <label className="form-label">Diagnóstico:</label>
              <input
                className="form-input"
                type="text"
                value={dados.diagnostico}
                onChange={(e) =>
                  setDados((d) => ({ ...d, diagnostico: e.target.value }))
                }
                readOnly={somenteLeitura}
              />
            </div>
            <div className="form-field">
              <label className="form-label">Observações:</label>
              <textarea
                className="form-textarea"
                value={dados.observacoes}
                onChange={(e) =>
                  setDados((d) => ({ ...d, observacoes: e.target.value }))
                }
                readOnly={somenteLeitura}
              />
            </div>
            {!somenteLeitura && (
              <div style={{ marginTop: 16 }}>
                <button onClick={salvar}>Salvar</button>
              </div>
            )}
          </div>
        );
      case "receituario":
        return mockList("Receituário", mock.receituario, (r) => (
          <div>
            <strong>{r.medicamento}</strong>
            <div className="muted">{r.posologia}</div>
            <div className="muted">Data: {r.data}</div>
          </div>
        ));
      case "exames":
        return mockList("Exames", mock.exames, (e) => (
          <div>
            <strong>{e.nome}</strong>
            <div className="muted">Resultado: {e.resultado}</div>
            <div className="muted">Data: {e.data}</div>
          </div>
        ));
      case "atestados":
        return mockList("Atestados e Declarações", mock.atestados, (a) => (
          <div>
            <strong>{a.tipo}</strong>
            <div className="muted">Dias: {a.dias}</div>
            <div className="muted">Data: {a.data}</div>
          </div>
        ));
      case "orientacoes":
        return mockList("Orientações", mock.orientacoes, (o) => (
          <div>
            <strong>{o.titulo}</strong>
            <div className="muted">{o.descricao}</div>
            <div className="muted">Data: {o.data}</div>
          </div>
        ));
      case "pareceres":
        return mockList("Laudos e Pareceres", mock.pareceres, (p) => (
          <div>
            <strong>{p.profissional}</strong>
            <div className="muted">{p.texto}</div>
            <div className="muted">Data: {p.data}</div>
          </div>
        ));
      case "visitasclinicas":
        return mockList("Visitas Clínicas", mock.visitasclinicas, (v) => (
          <div>
            <strong>{v.local}</strong>
            <div className="muted">{v.nota}</div>
            <div className="muted">Data: {v.data}</div>
          </div>
        ));
      case "orcamentos":
        return mockList("Orçamentos/Pedidos", mock.orcamentos, (o) => (
          <div>
            <strong>{o.item}</strong>
            <div className="muted">R$ {o.valor.toFixed(2)} — {o.status}</div>
            <div className="muted">Data: {o.data}</div>
          </div>
        ));
      default:
        return <p>Seção não encontrada.</p>;
    }
  };

  // Acordeão item
  const AccItem = ({ section }) => {
    const open = !!openSections[section.key];
    const toggle = () =>
      setOpenSections((s) => {
        const willOpen = !s[section.key];
        const next = { ...s, [section.key]: willOpen };
        if (willOpen) {
          const params = new URLSearchParams(window.location.search);
          params.set('tab', section.key);
          navigate({ search: params.toString() }, { replace: true });
        }
        return next;
      });
    return (
      <div className="acc-item">
        <button className={`acc-header ${open ? 'open' : ''}`} onClick={toggle}>
          <span className="acc-title">{section.label}</span>
          <span className="acc-right">
            <span className="acc-count">{counts[section.key] || 0}</span>
            <span className="acc-toggle">{open ? '▾' : '▸'}</span>
          </span>
        </button>
        {open && (
          <div className="acc-content">
            {/* Envolve conteúdo para aplicar largura e padding via card já existente */}
            <div className="content-area">
              {SectionContent(section.key)}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="prontuario-container">
      <div className="prontuario-header">
        <button className="btn-primary" onClick={() => navigate(-1)}>Voltar</button>
        <h2 className="prontuario-title">Prontuário — {paciente.nome}</h2>
      </div>

      <div className="prontuario-layout">
        {/* Coluna esquerda: resumo do paciente */}
        <aside className="patient-card card">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
            <div style={{ width: 120, height: 120, borderRadius: '50%', background: '#e5e7eb' }} />
          </div>
          <h3 style={{ textAlign: 'center', marginTop: 0 }}>{paciente.nome}</h3>
          <p className="muted" style={{ textAlign: 'center' }}>Paciente #{String(paciente.id).padStart(3, '0')}</p>
        </aside>

        {/* Coluna direita: dados pessoais abaixo do nome e acordeão */}
        <main className="prontuario-main">
          {/* Dados pessoais abaixo do nome */}
          <div className="content-area">
            {SectionContent('informacoes')}
          </div>

          {/* Acordeão de seções */}
          <div className="accordion">
            {sectionsDef.map((sec) => (
              <AccItem key={sec.key} section={sec} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
