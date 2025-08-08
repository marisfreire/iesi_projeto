import React, { useState } from "react";
import "./LoginForm.css";

export default function LoginForm() {
  const [userType, setUserType] = useState("discente");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          senha: password, 
        }),
      });

      const data = await response.json();
      console.log("Resposta do backend:", data);

      if (response.ok) {
        alert("Login OK!");
      } else {
        alert(data.error || "erro login");
      }
    } catch (err) {
      console.error("erro na requisição:", err);
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

      <div className="forgot-password">Esqueceu sua senha?</div>

      <button className="login-button" onClick={handleLogin}>
        LOGIN
      </button>
    </div>
  );
}
