#flask recebe os dados do front e faz a requisição na API real

import requests

def login_service(username, senha):
    try:
        response = requests.post("https://api.tisaude.com//api/login", json={
            "username": username,
            "senha": senha
        })
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        return{"error": "Credenciais Inválidas"}