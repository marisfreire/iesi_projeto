import React, { useMemo, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { pacientes } from "../data/pacientes";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function Prontuario() {
  const { id } = useParams();
  const query = useQuery();
  const role = query.get("role") || "discente"; // 'docente' edita, 'discente' só vê
  const navigate = useNavigate();

  const paciente = pacientes.find((p) => p.id === id);
  const [dados, setDados] = useState({
    diagnostico: paciente?.diagnostico || "",
    observacoes: paciente?.observacoes || "",
  });

  if (!paciente) {
    return (
      <div style={{ padding: 24 }}>
        <p>Paciente não encontrado.</p>
        <button onClick={() => navigate(-1)}>Voltar</button>
      </div>
    );
  }

  const somenteLeitura = role !== "docente";

  const salvar = () => {
    // Placeholder: enviar atualização para backend se role === 'docente'
    alert("Prontuário salvo (mock).");
    navigate(-1);
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Prontuário — {paciente.nome}</h2>
      <div style={{ marginTop: 16 }}>
        <label>
          Diagnóstico:
          <input
            style={{ marginLeft: 8 }}
            type="text"
            value={dados.diagnostico}
            onChange={(e) => setDados((d) => ({ ...d, diagnostico: e.target.value }))}
            readOnly={somenteLeitura}
          />
        </label>
      </div>
      <div style={{ marginTop: 12 }}>
        <label>
          Observações:
          <textarea
            style={{ display: "block", width: 400, height: 120, marginTop: 4 }}
            value={dados.observacoes}
            onChange={(e) => setDados((d) => ({ ...d, observacoes: e.target.value }))}
            readOnly={somenteLeitura}
          />
        </label>
      </div>

      <div style={{ marginTop: 16 }}>
        {somenteLeitura ? (
          <button onClick={() => navigate(-1)}>Voltar</button>
        ) : (
          <>
            <button onClick={salvar}>Salvar</button>
            <button style={{ marginLeft: 8 }} onClick={() => navigate(-1)}>
              Cancelar
            </button>
          </>
        )}
      </div>
    </div>
  );
}
