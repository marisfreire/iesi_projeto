import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";
import api from "../services/api";

export default function LoginForm() {
  const [userType, setUserType] = useState("discente");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

const handleLogin = async () => {
  try {
    const { data } = await api.post("/login", { username, senha: password, userType });

    if (data) {
      // Tenta extrair token de campos comuns
      const token = data?.access_token || data?.token || data?.data?.token;
      if (token) {
        localStorage.setItem("access_token", token);
      }
      if (data?.user?.name) {
        localStorage.setItem("displayName", data.user.name);
      }
      // Navegar conforme userType
      if (userType === "discente") navigate("/discente");
      else if (userType === "docente") navigate("/docente");
    } else {
      alert("Erro no login");
    }
  } catch (err) {
    console.error("Erro na requisição:", err);
  }
};


  return (
    <div className="login-container">
      <div className="user-type-buttons">
        <button
          className={userType === "discente" ? "selected" : ""}
          onClick={() => setUserType("discente")}
        >
          Discente
        </button>
        <button
          className={userType === "docente" ? "selected" : ""}
          onClick={() => setUserType("docente")}
        >
          Docente
        </button>
      </div>

      <div className="input-group">
        <label>
          <span className="icon">👤</span>
          <input
            type="text"
            placeholder="Nome de Usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
      </div>

      <div className="input-group">
        <label>
          <span className="icon">🔑</span>
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
      </div>

      <div className="forgot-password">
        <a
          href="https://clinic.tisaude.com/#/esqueciSenha"
          target="_blank"
          rel="noopener noreferrer"
        >
          Esqueceu sua senha?
        </a>
      </div>

      <button className="login-button" onClick={handleLogin}>
        LOGIN
      </button>
    </div>
  );
}
