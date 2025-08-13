import axios from "axios";

// Cliente axios básico para chamadas à API do backend
const api = axios.create({
  baseURL: "http://localhost:5000",
});

// Anexa o token (quando existir) em todas as requisições para o backend
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  } catch (_) {}
  return config;
});

export default api;

