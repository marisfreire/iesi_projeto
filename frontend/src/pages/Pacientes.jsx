import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ListagemPacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPacientes() {
      try {
        setLoading(true);
        setError(null);

        const username = "71484688414"; 
        const password = "Senhabonita123*";   
        const basicAuth = "Basic " + btoa(username + ":" + password);

        const response = await fetch(
          "https://api.tisaude.com/api/patients?search=&healthinsurance=&professional=&cellphone=&sex=&email=&mother=&father=&neighborhood=&city=&state=&maritalStatus=&status=",
          {
            headers: {
              "Authorization": basicAuth
            }
          }
        );

        if (!response.ok) {
          throw new Error(`Erro ao buscar pacientes: ${response.statusText}`);
        }

        const data = await response.json();

        setPacientes(data);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPacientes();
  }, []);

  function abrirDetalhes(paciente) {
    navigate("/detalhes-paciente", { state: { paciente } });
  }

  if (loading) {
    return <div>Carregando pacientes...</div>;
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Pacientes Encontrados</h2>
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
          <strong>#{p.id} - {p.nome}</strong>
          <div>Convênio: {p.convenio || p.healthinsurance || "N/A"}</div>
          <div>Status: {p.status}</div>
        </div>
      ))}
    </div>
  );
}
