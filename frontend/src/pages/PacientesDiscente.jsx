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
    <div style={{ padding: 20 }}>
      <h2>Pacientes Filtrados</h2>
      {pacientes.length === 0 && <div>Nenhum paciente encontrado.</div>}
      {pacientes.map((p) => (
        <div
          key={p.id}
          style={{
            border: "1px solid #ccc",
            marginBottom: 10,
            padding: 10,
            cursor: "pointer",
          }}
          onClick={() => abrirDetalhes(p)}
        >
          <strong>#{p.id} - {p.name}</strong>
          <div>Convênio: {p.healthInsurance?.name || "N/A"}</div>
          <div>Status: {p.status?.status || "N/A"}</div>
        </div>
      ))}
    </div>
  );
}
