import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";

//PACIENTES DO DOCENTE (APARECE TODOS)

export default function Pacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("access_token");

useEffect(() => {
  async function fetchPacientes() {
    try {
      setLoading(true);
      setError(null);

      const { data } = await api.get(
        "/pacientes",
        {
          params: {
            search: "",
            healthinsurance: "",
            professional: "",
            cellphone: "",
            sex: "",
            email: "",
            mother: "",
            father: "",
            neighborhood: "",
            city: "",
            state: "",
            maritalStatus: "",
            status: "",
          },
        }
      );

      const base = data?.patients || [];

      // Injeção de pacientes de teste (IDs 370 e 359) para validação do Prontuário
      const augmented = [...base];
      const exists = (list, id) => list.some((x) => String(x.id) === String(id));
      const addIfMissing = (obj) => {
        if (!exists(augmented, obj.id)) augmented.push(obj);
      };
      addIfMissing({ id: 370, name: "Paciente Teste 370", healthInsurance: { name: "N/A" }, status: { status: "Ativo" } });
      addIfMissing({ id: 359, name: "Paciente Teste 359", healthInsurance: { name: "N/A" }, status: { status: "Ativo" } });

      setPacientes(augmented);

  console.log("Dados do paciente:", data);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  fetchPacientes();
}, [token]);


  // Navegação para InfoPaciente removida

  function abrirProntuario(paciente) {
    const search = location.search || "";
    navigate(`/prontuario/${paciente.id}${search}`);
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
          style={{
            backgroundColor: "#ffffff",
            borderRadius: 12,
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            padding: 16,
            marginBottom: 16,
            cursor: "default",
            transition: "background-color 0.2s ease",
          }}
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
          <div style={{ marginTop: 10 }}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                abrirProntuario(p);
              }}
              style={{
                backgroundColor: "#00b2a9",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              Abrir Prontuário
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}