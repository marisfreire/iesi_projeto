import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PacientesDiscente() {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    async function fetchPacientes() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
        "https://api.tisaude.com/api/patients?search=&healthinsurance=&professional=&cellphone=&sex=&email=&mother=&father=&neighborhood=&city=&state=&maritalStatus=&status=",
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Não autorizado. Faça login novamente.");
          }
          throw new Error(`Erro ao buscar pacientes: ${response.statusText}`);
        }

        const json = await response.json();

        //AQUI APLICA O FILTRO DOS PACIENTES DESIGNADOS PARA AQUELE ALUNO
        const filtrados = (json.data || []).filter(
          (p) =>
            p.name === "RENAN SANTANA" ||
            p.name === "RENAN LUIS JOAB BYANCA DOS SANTOS"
        );

        setPacientes(filtrados);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPacientes();
  }, [token]);

  function abrirDetalhes(paciente) {
  navigate(`/infopaciente/${paciente.id}`);
}

  if (loading) return <div>Carregando pacientes...</div>;
  if (error) return <div>Erro: {error}</div>;

return (
  <div
    style={{
      padding: 30,
      maxWidth: "100%",
      margin: "0 auto",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: "#f5f9fa",
      minHeight: "100vh",
    }}
  >
    <h2
      style={{
        fontWeight: "700",
        fontSize: "1.8rem",
        color: "#2e3b4e",
        borderBottom: "4px solid #86b4af",
        paddingBottom: 10,
        marginBottom: 24,
        textAlign: "center",
      }}
    >
      Pacientes Encontrados
    </h2>

    {pacientes.length === 0 && (
      <div
        style={{
          color: "#7a7a7a",
          fontSize: 16,
          textAlign: "center",
          padding: 20,
        }}
      >
        Nenhum paciente encontrado.
      </div>
    )}

    {pacientes.map((p) => (
      <div
        key={p.id}
        onClick={() => abrirDetalhes(p)}
        style={{
          backgroundColor: "#fff",
          borderRadius: 12,
          padding: 20,
          marginBottom: 18,
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          transition: "transform 0.15s ease-in-out",
          border: "1.5px solid transparent",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.02)";
          e.currentTarget.style.borderColor = "#86b4af";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.12)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.borderColor = "transparent";
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
        }}
      >
        <strong
          style={{
            fontWeight: "700",
            fontSize: 18,
            color: "#2e3b4e",
            textTransform: "uppercase",
          }}
        >
          #{p.id} - {p.name}
        </strong>
        <div style={{ color: "#5c6c70", marginTop: 8, fontSize: 15 }}>
          Convênio:{" "}
          <span style={{ fontWeight: "600", color: "#3c3c3c" }}>
            {p.healthInsurance?.name || "N/A"}
          </span>
        </div>
        <div style={{ color: "#5c6c70", marginTop: 6, fontSize: 15 }}>
          Status:{" "}
          <span style={{ fontWeight: "600", color: "#3c3c3c" }}>
            {p.status?.status || "N/A"}
          </span>
        </div>
      </div>
    ))}
  </div>
)};
