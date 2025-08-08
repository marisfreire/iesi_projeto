import axios from "axios";

const handleLogin = async () => {
  try {
    const response = await axios.post("http://localhost:5000/login", {
      username,
      senha: password,
    });

    console.log("resposta backend:", response.data);
  } catch (error) {
    console.error("erro no login:", error);
  }
};

