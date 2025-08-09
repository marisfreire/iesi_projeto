import axios from "axios";

// Cliente axios básico para chamadas à API do backend
const api = axios.create({
  baseURL: "http://localhost:5000",
});

export default api;

