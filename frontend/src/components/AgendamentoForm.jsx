import React, { useState } from "react";
import "./AgendamentoForm.css";

export default function Agendamento() {
  const [formData, setFormData] = useState({
    nome: "",
    nacionalidade: "Brasil",
    cpf: "",
    convenio: "PARTICULAR",
    dataNascimento: "",
    celular: "",
    email: "",
    encaminhadoPor: "",
    cartaoSaude: "",
    data: "",
    local: "CONSULTORIO",
    agenda: "",
    horario: "",
    procedimento: "consulta"
  });

  const [pacientesSugestoes, setPacientesSugestoes] = useState([]);
  const [showSugestoes, setShowSugestoes] = useState(false);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if(name === "nome" && value.length > 1) {
      try {
        const response = await fetch(`http://localhost:5000/pacientes?search=${value}`);
        const json = await response.json();
        console.log("Resposta pacientes:", json);
        setPacientesSugestoes(Array.isArray(json) ? json : json.patients || []);
        setShowSugestoes(true);
      } catch (err) {
        console.error("Erro ao buscar pacientes:", err);
      }
    } else {
      setShowSugestoes(false);
    }
  };

  const selecionarPaciente = (paciente) => {
    setFormData({ ...formData, nome: paciente.name });
    setShowSugestoes(false);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:5000/agendamento", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Resposta da API:", data);

      if (response.ok) {
        alert("Agendamento realizado com sucesso!");
        setFormData({
          nome: "",
          nacionalidade: "Brasil",
          cpf: "",
          convenio: "PARTICULAR",
          dataNascimento: "",
          celular: "",
          email: "",
          encaminhadoPor: "",
          cartaoSaude: "",
          data: "",
          local: "CONSULTORIO",
          agenda: "",
          horario: "",
          procedimento: "consulta"
        });
      } else {
        alert(data.error || "Erro ao agendar");
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
    }
  };

  return (
    <div className="agendamento-container">
      <h2>Novo agendamento</h2>

      <div className="section">
        <h3>PACIENTE</h3>
        <div>
          <input type="text" name="nome" placeholder="Nome *" value={formData.nome} onChange={handleChange}className="nome-input" />
          {showSugestoes && pacientesSugestoes.length > 0 && (
            <ul className="sugestoes-lista">
              {pacientesSugestoes.map((p) => (
                <li key={p.id} onClick={() => selecionarPaciente(p)}>
                  {p.name} <span style={{ color: "gray" }}>#{p.id}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="row">
          <select name="nacionalidade" value={formData.nacionalidade} onChange={handleChange}>
            <option value="Brasil">Brasil</option>
            <option value="Outro">Outro</option>
          </select>
          <input type="text" name="cpf" placeholder="CPF" value={formData.cpf} onChange={handleChange} />
          <select name="convenio" value={formData.convenio} onChange={handleChange}>
            <option value="Particular">Particular</option>
            <option value="SUS">SUS</option>
            <option value="AMIL">AMIL</option>
          </select>
          <input type="date" name="dataNascimento" value={formData.dataNascimento} onChange={handleChange} />
        </div>

        <div className="row">
          <input type="tel" name="celular" placeholder="Celular" value={formData.celular} onChange={handleChange} />
          <input type="email" name="email" placeholder="E-mail" value={formData.email} onChange={handleChange} />
          <input type="text" name="encaminhadoPor" placeholder="Encaminhado(a) por" value={formData.encaminhadoPor} onChange={handleChange} />
          <input type="text" name="cartaoSaude" placeholder="Carteira Nacional de Saúde" value={formData.cartaoSaude} onChange={handleChange} />
        </div>
      </div>

      <div className="section">
        <h3>AGENDAMENTO</h3>
        <div className="row">
          <input type="date" name="data" value={formData.data} onChange={handleChange} />
          <select name="local" value={formData.local} onChange={handleChange}>
            <option value="CONSULTORIO">CONSULTÓRIO</option>
            <option value="OUTRO">OUTRO</option>
          </select>
          <select name="agenda" value={formData.agenda} onChange={handleChange}>
            <option value="Professor 1">Professor 1</option>
            <option value="Progessor 2">Professor 2</option>
            <option value="Professor 3">Professor 3</option>
          </select>
          <input type="time" name="horario" value={formData.horario} onChange={handleChange} />
        </div>

        <select name="procedimento" value={formData.procedimento} onChange={handleChange}>
          <option value="consulta">Exame de imagem</option>
        </select>
      </div>

      <button onClick={handleSubmit} className="submit-button">Salvar</button>
    </div>
  );
}
