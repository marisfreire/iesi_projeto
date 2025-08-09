import React from "react";

export default function AcompanhamentoEstudante() {
  return (
    <div style={{ padding: 24 }}>
      <h2>Acompanhamento do Estudante</h2>
      <section style={{ marginTop: 16 }}>
        <h3>Histórico de Exames</h3>
        <p>Lista de exames do discente (substituir por dados reais da API).</p>
        <ul>
          <li>Exame 01 - 2025-07-12 - Resultado: OK</li>
          <li>Exame 02 - 2025-06-05 - Resultado: Observação</li>
        </ul>
      </section>
      <section style={{ marginTop: 16 }}>
        <h3>Relatórios</h3>
        <p>Relatórios e anotações do acompanhamento.</p>
      </section>
    </div>
  );
}
