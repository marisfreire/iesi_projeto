import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { pacientes } from "../data/pacientes";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function Prontuarios() {
  const query = useQuery();
  const role = query.get("role") || "discente";
  const user = query.get("user") || localStorage.getItem("username") || "lavoisier";

  const lista = useMemo(() => {
    if (role === "docente") return pacientes;
    return pacientes.filter((p) => p.responsaveis.includes(user.toLowerCase()));
  }, [role, user]);

  return (
    <div style={{ padding: 24 }}>
      <h2>Prontuários ({role})</h2>
      {lista.length === 0 ? (
        <p>Nenhum prontuário disponível.</p>
      ) : (
        <ul>
          {lista.map((p) => (
            <li key={p.id} style={{ marginBottom: 8 }}>
              <strong>{p.nome}</strong>
              {" - "}
              <Link to={`/prontuario/${p.id}?role=${role}&user=${encodeURIComponent(user)}`}>
                Acessar prontuário
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
