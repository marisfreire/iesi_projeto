import React, { useState } from "react";

export default function AcompanhamentoEstudante() {
  const [abaAtiva, setAbaAtiva] = useState("historico");
  const [relatorio, setRelatorio] = useState("");

  const historicoMock = [
    { id: 1, titulo: "Relatório 01", data: "2025-07-12", avaliado: true },
    { id: 2, titulo: "Relatório 02", data: "2025-06-05", avaliado: false },
  ];

  const enviarRelatorio = () => {
    if (relatorio.trim() === "") {
      alert("Escreva algo antes de enviar!");
      return;
    }
    alert("Relatório enviado:\n" + relatorio);
    setRelatorio("");
  };

  const verdeSuave = "#87bfbfff";

  const containerStyle = {
    minHeight: "100vh",
    backgroundColor: "#f5f9fa",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: 24,
    color: "#2c3e50",
  };

  const tituloStyle = {
    fontWeight: "700",
    fontSize: 32,
    marginBottom: 24,
    paddingBottom: 8,
    maxWidth: 500, 
    borderBottom: `4px solid ${verdeSuave}`,
  };

  const abasContainer = {
    display: "flex",
    gap: 16,
    marginBottom: 32,
  };

  const abaStyle = (ativa) => ({
    flex: 1,
    backgroundColor: ativa ? verdeSuave : "#e1e8f0",
    borderRadius: 12,
    boxShadow: ativa ? `0 4px 8px ${verdeSuave}66` : "none", // sombra verde transparente
    padding: 16,
    textAlign: "center",
    cursor: "pointer",
    color: ativa ? "#fff" : "#34495e",
    fontWeight: "600",
    fontSize: 18,
    userSelect: "none",
    transition: "all 0.3s ease",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  });

  const IconHistorico = () => (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <line x1="9" y1="4" x2="9" y2="22" />
    </svg>
  );

  const IconRelatorio = () => (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
  );

  const historicoLista = {
    listStyleType: "none",
    paddingLeft: 0,
    color: "#34495e",
    fontSize: 16,
  };

  const itemHistorico = {
    marginBottom: 12,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const statusAvaliado = {
    color: "#27ae60",
    fontWeight: "600",
    fontSize: 14,
    backgroundColor: "#dff0d8",
    padding: "4px 12px",
    borderRadius: 20,
  };

  const statusPendente = {
    color: "#f39c12",
    fontWeight: "600",
    fontSize: 14,
    backgroundColor: "#fcf8e3",
    padding: "4px 12px",
    borderRadius: 20,
  };

  const textareaStyle = {
    width: "100%",
    minHeight: 140,
    borderRadius: 12,
    border: `2px solid ${verdeSuave}`,
    padding: 12,
    fontSize: 16,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    resize: "vertical",
    color: "#2c3e50",
    backgroundColor: "#fefefe",
    boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
    transition: "border-color 0.3s",
  };

  const btnEnviarStyle = {
    marginTop: 16,
    backgroundColor: verdeSuave,
    color: "white",
    border: "none",
    borderRadius: 12,
    padding: "12px 28px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: 16,
    transition: "background-color 0.3s",
  };

  return (
    <div style={containerStyle}>
      <h1 style={tituloStyle}>Acompanhamento do Estudante</h1>

      <div style={abasContainer}>
        <div
          style={abaStyle(abaAtiva === "historico")}
          onClick={() => setAbaAtiva("historico")}
          role="button"
          tabIndex={0}
          onKeyDown={() => setAbaAtiva("historico")}
          aria-label="Aba Histórico"
        >
          <IconHistorico />
          Histórico
        </div>

        <div
          style={abaStyle(abaAtiva === "relatorio")}
          onClick={() => setAbaAtiva("relatorio")}
          role="button"
          tabIndex={0}
          onKeyDown={() => setAbaAtiva("relatorio")}
          aria-label="Aba Relatório"
        >
          <IconRelatorio />
          Relatório
        </div>
      </div>

      {abaAtiva === "historico" && (
        <ul style={historicoLista}>
          {historicoMock.map(({ id, titulo, data, avaliado }) => (
            <li key={id} style={itemHistorico}>
              <span>
                <strong>{titulo}</strong> - {data}
              </span>
              <span style={avaliado ? statusAvaliado : statusPendente}>
                {avaliado ? "Avaliado" : "Pendente"}
              </span>
            </li>
          ))}
        </ul>
      )}

      {abaAtiva === "relatorio" && (
        <div>
          <textarea
            placeholder="Digite seu relatório aqui..."
            value={relatorio}
            onChange={(e) => setRelatorio(e.target.value)}
            style={textareaStyle}
          />
          <button onClick={enviarRelatorio} style={btnEnviarStyle}>
            Enviar
          </button>
        </div>
      )}
    </div>
  );
}
