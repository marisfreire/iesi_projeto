import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "./Prontuario.css";
import api from "../services/api";

export default function Prontuario() {
  const { id } = useParams();
  const { search } = useLocation();
  const navigate = useNavigate();
  const query = useMemo(() => new URLSearchParams(search), [search]);
  const initialTab = (query.get("tab") || "fichas").toLowerCase();

  const [paciente, setPaciente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabs, setTabs] = useState([]);
  const [tabsError, setTabsError] = useState(null);
  const [itemsByTab, setItemsByTab] = useState({}); // { [tab]: { loading, error, items } }
  const [detailsByKey, setDetailsByKey] = useState({}); // { [`${tab}:${docId}`]: { loading, error, data } }

  // Ordem canônica das seções
  const sectionsOrder = useMemo(() => [
    "fichas",
    "receituario",
    "exames",
    "atestados",
    "orientacoes",
    "pareceres",
    "visitasclinicas",
    "orcamentos",
  ], []);

  // Estado do acordeão
  const [openSections, setOpenSections] = useState({});

  useEffect(() => {
    let cancelled = false;
  async function fetchPaciente() {
      try {
        setLoading(true);
        setError(null);
    const { data } = await api.get("/get_data", { params: { resource: "paciente", id } });
    if (!cancelled) setPaciente(data);
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchPaciente();
    return () => { cancelled = true; };
  }, [id]);

  // Busca as abas e contadores
  useEffect(() => {
    let cancelled = false;
  async function fetchTabs() {
  try {
        setTabsError(null);
    const { data } = await api.get("/get_data", { params: { resource: "ehr_tabs", id, onlyTab: 0 } });
    if (!cancelled) setTabs(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setTabsError(e.message);
  } finally {
  }
    }
    fetchTabs();
    return () => { cancelled = true; };
  }, [id]);

  // Inicializa o acordeão considerando ?tab
  useEffect(() => {
    const availableKeys = new Set(tabs.map((t) => t.tab));
    const validInit = availableKeys.has(initialTab) ? initialTab : "fichas";
    setOpenSections({ [validInit]: true });

    // Garante que ?tab exista
    const params = new URLSearchParams(search);
    if (!params.get("tab") || params.get("tab") !== validInit) {
      params.set("tab", validInit);
      navigate({ search: params.toString() }, { replace: true });
    }
  }, [initialTab, tabs, navigate, search]);

  // Mapa de labels e contadores
  const labels = useMemo(() => {
    const map = new Map();
    tabs.forEach((t) => map.set(t.tab, t.name));
    return map;
  }, [tabs]);

  const counts = useMemo(() => {
    const map = Object.fromEntries(sectionsOrder.map((k) => [k, 0]));
    tabs.forEach((t) => (map[t.tab] = t.countDocuments || 0));
    return map;
  }, [tabs, sectionsOrder]);

  const AccItem = ({ sectionKey }) => {
    const label = labels.get(sectionKey) ||
      ({
        fichas: "Fichas",
        receituario: "Receituário",
        exames: "Exames",
        atestados: "Atestados e Declarações",
        orientacoes: "Orientações",
        pareceres: "Laudos e Pareceres",
        visitasclinicas: "Visitas Clínicas",
        orcamentos: "Orçamentos/Pedidos",
      }[sectionKey] || sectionKey);
    const open = !!openSections[sectionKey];
    const toggle = () =>
      setOpenSections((s) => {
        const willOpen = !s[sectionKey];
        const next = { ...s, [sectionKey]: willOpen };
        if (willOpen) {
          const params = new URLSearchParams(window.location.search);
          params.set("tab", sectionKey);
          navigate({ search: params.toString() }, { replace: true });
          // Carrega a lista da aba, se ainda não carregada
          const bucket = itemsByTab[sectionKey];
          if (!bucket || (!bucket.items && !bucket.loading)) {
            (async () => {
              try {
                setItemsByTab((prev) => ({
                  ...prev,
                  [sectionKey]: { ...(prev[sectionKey] || {}), loading: true, error: null },
                }));
                const { data } = await api.get("/get_data", { params: { resource: "ehr_list", id, tab: sectionKey } });
                const arr = data;
                setItemsByTab((prev) => ({
                  ...prev,
                  [sectionKey]: { loading: false, error: null, items: Array.isArray(arr) ? arr : [] },
                }));
              } catch (e) {
                setItemsByTab((prev) => ({
                  ...prev,
                  [sectionKey]: { loading: false, error: e.message, items: [] },
                }));
              }
            })();
          }
        }
        return next;
      });

    const itemsBucket = itemsByTab[sectionKey] || { loading: false, error: null, items: [] };

    const verDetalhes = async (docId) => {
      const key = `${sectionKey}:${docId}`;
      // evita refetch se já existir
      const existing = detailsByKey[key];
      if (existing && (existing.loading || existing.data)) return;
      try {
        setDetailsByKey((prev) => ({ ...prev, [key]: { loading: true, error: null, data: null } }));
  const { data } = await api.get("/get_data", { params: { resource: "ehr_doc", id, tab: sectionKey, docId, history: 0 } });
  setDetailsByKey((prev) => ({ ...prev, [key]: { loading: false, error: null, data } }));
      } catch (e) {
        setDetailsByKey((prev) => ({ ...prev, [key]: { loading: false, error: e.message, data: null } }));
      }
    };
    return (
      <div className="acc-item" role="region" aria-labelledby={`acc-header-${sectionKey}`}>
        <button
          id={`acc-header-${sectionKey}`}
          className={`acc-header ${open ? "open" : ""}`}
          onClick={toggle}
          aria-controls={`acc-panel-${sectionKey}`}
          aria-expanded={open}
        >
          <span className="acc-title">{label}</span>
          <span className="acc-right">
            <span className="acc-count" aria-label={`Quantidade em ${label}`}>
              {counts[sectionKey] || 0}
            </span>
            <span className="acc-toggle" aria-hidden="true">{open ? "▾" : "▸"}</span>
          </span>
        </button>
        {open && (
          <div
            id={`acc-panel-${sectionKey}`}
            className="acc-content"
            role="region"
            aria-labelledby={`acc-header-${sectionKey}`}
          >
            <div className="content-area">
              <div className="card">
                {itemsBucket.loading && <p className="muted">Carregando {label.toLowerCase()}…</p>}
                {itemsBucket.error && !itemsBucket.loading && (
                  <p className="muted">Erro: {itemsBucket.error}</p>
                )}
                {!itemsBucket.loading && !itemsBucket.error && itemsBucket.items?.length === 0 && (
                  <p className="muted">Nenhum registro disponível.</p>
                )}
                {!itemsBucket.loading && !itemsBucket.error && itemsBucket.items?.length > 0 && (
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {itemsBucket.items.map((it) => {
                      const dkey = `${sectionKey}:${it.id}`;
                      const det = detailsByKey[dkey];
                      return (
                        <li key={it.id} style={{ padding: "10px 6px", borderBottom: "1px solid #eef2f3" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                            <div>
                              <div style={{ fontWeight: 600 }}>{it.name || `Documento #${it.id}`}</div>
                              <div className="muted" style={{ fontSize: 13 }}>
                                {it.date ? `Data: ${it.date}` : null}
                                {it.by ? `  •  Por: ${it.by}` : null}
                              </div>
                            </div>
                            <div>
                              <button
                                className="btn-primary"
                                onClick={() => verDetalhes(it.id)}
                                aria-expanded={!!(det && det.data)}
                                aria-controls={`doc-${sectionKey}-${it.id}`}
                              >
                                Ver detalhes
                              </button>
                            </div>
                          </div>
                          {det && det.loading && (
                            <div id={`doc-${sectionKey}-${it.id}`} className="muted" style={{ marginTop: 8 }}>Carregando…</div>
                          )}
                          {det && det.error && !det.loading && (
                            <div id={`doc-${sectionKey}-${it.id}`} className="muted" style={{ marginTop: 8 }}>Erro: {det.error}</div>
                          )}
                          {det && det.data && (
                            <div id={`doc-${sectionKey}-${it.id}`} style={{ marginTop: 8, background: "#f8fffe", border: "1px solid #e0f2f1", borderRadius: 8, padding: 10 }}>
                              <div style={{ fontWeight: 600 }}>{det.data.ehrActual?.title || it.name}</div>
                              <div className="muted" style={{ fontSize: 13 }}>
                                Preenchido por: {det.data.ehrActual?.filledBy || it.by} — Data: {det.data.ehrActual?.date || it.date}
                              </div>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return <div style={{ padding: 24 }}>Carregando prontuário…</div>;
  }

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <p>Erro: {error}</p>
        <button onClick={() => navigate(-1)}>Voltar</button>
      </div>
    );
  }

  if (!paciente) {
    return (
      <div style={{ padding: 24 }}>
        <p>Paciente não encontrado.</p>
        <button onClick={() => navigate(-1)}>Voltar</button>
      </div>
    );
  }

  return (
    <div className="prontuario-container">
      <div className="prontuario-header">
        <button className="btn-primary" onClick={() => navigate(-1)}>Voltar</button>
        <h2 className="prontuario-title">Prontuário — {paciente.name || paciente.nome || "Sem nome"}</h2>
      </div>

      <div className="prontuario-layout">
        {/* Coluna esquerda */}
        <aside className="patient-card card">
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
            <div style={{ width: 120, height: 120, borderRadius: "50%", background: "#e5e7eb" }} />
          </div>
          <h3 style={{ marginTop: 0 }}>{paciente.name || paciente.nome || "—"}</h3>
          <p className="muted">Paciente #{String(paciente.id).padStart(3, '0')}</p>

          {/* Dados pessoais agora abaixo da imagem e do nome */}
          <div style={{ marginTop: 16 }}>
            <h4 style={{ margin: "0 0 8px 0", color: "#006064", textAlign: "center" }}>Dados Pessoais</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", rowGap: 6, textAlign: "left" }}>
              <p style={{ margin: 0 }}><strong>Nome:</strong> {paciente.name || "—"}</p>
              <p style={{ margin: 0 }}><strong>CPF:</strong> {paciente.cpf || "—"}</p>
              <p style={{ margin: 0 }}><strong>Idade:</strong> {paciente.agePatient || "—"}</p>
              <p style={{ margin: 0 }}><strong>Nascimento:</strong> {paciente.dateOfBirth || "—"}</p>
              <p style={{ margin: 0 }}><strong>Convênio:</strong> {paciente.healthInsurance?.name || "—"}</p>
              <p style={{ margin: 0 }}><strong>Status:</strong> {paciente.status?.status || "—"}</p>
              <p style={{ margin: 0 }}><strong>ID:</strong> {paciente.id}</p>
            </div>
          </div>
        </aside>

        {/* Coluna direita */}
        <main className="prontuario-main">
          {/* Acordeão de seções (contadores da API) */}
          <div className="accordion">
            {sectionsOrder.map((key) => (
              <AccItem key={key} sectionKey={key} />
            ))}
          </div>

          {tabsError && (
            <p className="muted" style={{ marginTop: 8 }}>Erro ao carregar abas: {tabsError}</p>
          )}
        </main>
      </div>
    </div>
  );
}
