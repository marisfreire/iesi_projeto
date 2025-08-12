import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//PACIENTES DO DOCENTE (APARECE TODOS)

export default function Pacientes() {
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
          setError("Não autorizado. Faça login novamente.");
          return;
        }
        throw new Error(`Erro ao buscar pacientes: ${response.statusText}`);
      }

      const json = await response.json();
      setPacientes(json.data || []);

      console.log("Dados do paciente:", json);

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

  if (loading) {
    return <div>Carregando pacientes...</div>;
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }

  return (
    <div
      style={{
        padding: 20,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      <h2
        style={{
          color: "#2c3e50",
          borderBottom: "4px solid #7cb1ad",
          paddingBottom: 8,
          marginBottom: 20,
          fontWeight: "bold",
          fontSize: 28,
        }}
      >
        Pacientes Encontrados
      </h2>

      {pacientes.length === 0 && (
        <div
          style={{
            fontSize: 18,
            color: "#777",
            marginTop: 20,
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
            backgroundColor: "#ffffff",
            borderRadius: 12,
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            padding: 16,
            marginBottom: 16,
            cursor: "pointer",
            transition: "background-color 0.2s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#e0f2f1")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#ffffff")
          }
        >
          <strong style={{ fontSize: 20, color: "#34495e" }}>
            #{p.id} - {p.name}
          </strong>
          <div style={{ marginTop: 6, color: "#4f6367", fontSize: 16 }}>
            Convênio: {p.healthInsurance?.name || "N/A"}
          </div>
          <div style={{ marginTop: 2, color: "#4f6367", fontSize: 16 }}>
            Status: {p.status?.status || "N/A"}
          </div>
        </div>
      ))}
    </div>
  );
}