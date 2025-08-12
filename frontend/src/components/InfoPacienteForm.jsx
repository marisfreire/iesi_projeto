import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function DetalhesPaciente() {
  const location = useLocation();
  const navigate = useNavigate();
  const paciente = location.state?.paciente;

  const [abaAtiva, setAbaAtiva] = useState("linha");
  const [relatorio, setRelatorio] = useState("");

  if (!paciente) {
    return (
      <div style={{ padding: 20 }}>
        <p>Nenhum paciente selecionado.</p>
        <button onClick={() => navigate("/")}>Voltar à lista</button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", fontFamily: "Arial, sans-serif", height: "100vh" }}>
      {/* Lado esquerdo - foto + dados */}
      <div style={{ width: 300, padding: 20, borderRight: "1px solid #ccc" }}>
        <div
          style={{
            width: 200,
            height: 200,
            backgroundColor: "#ddd",
            borderRadius: 10,
            marginBottom: 20,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 50,
            color: "#888",
            userSelect: "none",
          }}
        >
          📷
        </div>
        <div style={{ fontWeight: "bold", fontSize: 18, marginBottom: 10 }}>{paciente.nome}</div>
        <div>
          <strong>CPF:</strong> {paciente.cpf}
        </div>
        <div>
          <strong>Convênio:</strong> {paciente.convenio}
        </div>
      </div>

      {/* Lado direito - abas */}
      <div style={{ flex: 1, padding: 20 }}>
        {/* Botões das abas */}
        <div style={{ marginBottom: 20, borderBottom: "1px solid #ccc", display: "flex", gap: 15 }}>
          <button
            onClick={() => setAbaAtiva("linha")}
            style={{
              padding: "10px 20px",
              border: "none",
              borderBottom: abaAtiva === "linha" ? "3px solid teal" : "none",
              backgroundColor: "transparent",
              cursor: "pointer",
              fontWeight: abaAtiva === "linha" ? "bold" : "normal",
            }}
          >
            Linha do Tempo
          </button>
          <button
            onClick={() => setAbaAtiva("exames")}
            style={{
              padding: "10px 20px",
              border: "none",
              borderBottom: abaAtiva === "exames" ? "3px solid teal" : "none",
              backgroundColor: "transparent",
              cursor: "pointer",
              fontWeight: abaAtiva === "exames" ? "bold" : "normal",
            }}
          >
            Exames
          </button>
          <button
            onClick={() => setAbaAtiva("prontuario")}
            style={{
              padding: "10px 20px",
              border: "none",
              borderBottom: abaAtiva === "prontuario" ? "3px solid teal" : "none",
              backgroundColor: "transparent",
              cursor: "pointer",
              fontWeight: abaAtiva === "prontuario" ? "bold" : "normal",
            }}
          >
            Prontuário
          </button>
        </div>

        {/* Conteúdo das abas */}
        {abaAtiva === "linha" && (
          <div>
            <h2>Histórico de Consultas</h2>
            {paciente.consultas.length === 0 ? (
              <p>Nenhuma consulta encontrada.</p>
            ) : (
              <ul>
                {paciente.consultas.map((consulta) => (
                  <li key={consulta.id}>
                    <strong>{consulta.data}:</strong> {consulta.descricao}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {abaAtiva === "exames" && (
          <div>
            <h2>Resultados de Exames</h2>
            {paciente.exames.length === 0 ? (
              <p>Nenhum exame encontrado.</p>
            ) : (
              <ul>
                {paciente.exames.map((exame) => (
                  <li key={exame.id}>
                    <strong>{exame.tipo}:</strong> {exame.resultado}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {abaAtiva === "prontuario" && (
          <div>
            <h2>Relatório</h2>
            <textarea
              placeholder="Digite o relatório aqui..."
              rows={8}
              style={{ width: "100%", padding: 10, fontSize: 16, borderRadius: 5, border: "1px solid #ccc" }}
              value={relatorio}
              onChange={(e) => setRelatorio(e.target.value)}
            />
            <button
              onClick={() => alert("Relatório salvo! (Mock)")}
              style={{
                marginTop: 10,
                padding: "10px 15px",
                backgroundColor: "teal",
                color: "white",
                border: "none",
                borderRadius: 5,
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Salvar Relatório
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
