import React, { useState } from "react";
import "./AgendamentoForm.css";
import api from "../services/api";

const opcoesProcedimentos = [
  { label: "Consulta", value: "CONSULTA" },
  { label: "Retorno", value: "RETORNO" },
  { label: "Teleconsulta", value: "TELECONSULTA" },
];

const procedimentoMap = {
  CONSULTA: 1,
  RETORNO: 2,
  TELECONSULTA: 3
};

const localMap = {
  CONSULTORIO: 1,
  OUTRO: 2,
};

export default function Agendamento() {
  const [formData, setFormData] = useState({
    nome: "",
    nacionalidade: "Brasil",
    cpf: "",
    convenio: "PARTICULAR",
    dateOfBirth: "",
    cellphone: "",
    email: "",
    encaminhadoPor: "",
    cartaoSaude: "",
    data: "",
    local: "CONSULTORIO",
    agenda: "",
    horario: "",
    procedimentos: ["CONSULTA"],
    idCalendar: 236,
    idPatient: null,
  });

  const [pacientesSugestoes, setPacientesSugestoes] = useState([]);
  const [showSugestoes, setShowSugestoes] = useState(false);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if(name === "nome" && value.length > 1) {
      try {
        const { data } = await api.get("/get_data", { params: { resource: "pacientes", search: value } });
        console.log("Resposta pacientes:", data);
        setPacientesSugestoes(Array.isArray(data) ? data : data.patients || []);
        setShowSugestoes(true);
      } catch (err) {
        console.error("Erro ao buscar pacientes:", err);
      }
    } else {
      setShowSugestoes(false);
    }
  };

  const selecionarPaciente = (paciente) => {
    setFormData({ ...formData, 
      nome: paciente.name, 
      idPatient: paciente.id, 
      cpf: paciente.cpf, 
      cellphone: paciente.cellphone, 
      dateOfBirth: paciente.dateOfBirth, 
      email: paciente.email 
    });
    setShowSugestoes(false);
  };

  const montarPayload = () => {
    const proceduresIds = formData.procedimentos.map((proc) => procedimentoMap[proc] || 1);
    let dateVal = null;
    if (formData.dateOfBirth) {
      const [year, month, day] = formData.dateOfBirth.split("-");
      if (year && month && day) {
        dateVal = `${day}/${month}/${year}`;
      }
    }
    return {
      idPatient: formData.idPatient || null,
      name: formData.nome,
      nacionalidade: formData.nacionalidade,
      cpf: formData.cpf.replace(/\D/g, ""),
      convenio: formData.convenio,
      dateOfBirth: dateVal,
      cellphone: formData.cellphone,
      email: formData.email,
      encaminhadoPor: formData.encaminhadoPor,
      cartaoSaude: formData.cartaoSaude,
      schedule: [
        {
          id: "",
          dateSchudule: formData.data.split("-").reverse().join("/"), // yyyy-mm-dd => dd/mm/yyyy
          local: localMap[formData.local] || 1,
          idCalendar: 236,
          procedures: proceduresIds,   // chave correta: 'procedures'
          hour: formData.horario ? formData.horario + ":00" : "",
        },
      ],
    };
  };  

  const handleSubmit = async () => {
    try {
      const payload = montarPayload();
      const { data } = await api.post("/agendamento", payload);
      console.log("Resposta da API:", data);

      if (data) {
        alert("Agendamento realizado com sucesso!");
        setFormData({
          nome: "",
          nacionalidade: "Brasil",
          cpf: "",
          convenio: "PARTICULAR",
          dateOfBirth: "",
          cellphone: "",
          email: "",
          encaminhadoPor: "",
          cartaoSaude: "",
          data: "",
          local: "CONSULTORIO",
          agenda: "",
          horario: "",
          procedimentos: ["CONSULTA"],
        });
      } else {
        alert("Erro ao agendar");
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
          <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
        </div>

        <div className="row">
          <input type="tel" name="cellphone" placeholder="Celular" value={formData.cellphone} onChange={handleChange} />
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

        <select name="procedimento" multiple value={formData.procedimentos} onChange={(e) => {
          const selectedOptions = Array.from(e.target.selectedOptions).map(
            (option) => option.value
          );
          setFormData((prev) => ({ ...prev, procedimentos: selectedOptions })); 
          }}
        >
          {opcoesProcedimentos.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <button onClick={handleSubmit} className="submit-button">Salvar</button>
    </div>
  );
}
