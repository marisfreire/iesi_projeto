from flask import Flask, Blueprint, jsonify, request
import requests  

app = Flask(__name__)
pacientes_bp = Blueprint('pacientes', __name__)

@pacientes_bp.route('/pacientes', methods=['GET'])
def listar_pacientes():

    token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FwaS50aXNhdWRlLmNvbSIsImlhdCI6MTc1NTAxMjI0OCwiZXhwIjoxNzU3NjA0MjQ4LCJuYmYiOjE3NTUwMTIyNDgsImp0aSI6IkNNRTFXVHJOSFBOZWZHamgiLCJzdWIiOiI4Nzg4NSIsInBydiI6IjU4NzA4NjNkNGE2MmQ3OTE0NDNmYWY5MzZmYzM2ODAzMWQxMTBjNGYifQ.XT_qpWzgM-enSuBgdUOJ8WrhPk84YLtQ5B2UKcRGG1Y"
    params = request.args.to_dict()
    print("Params recebidos:", params)
    if 'nome' in params:
        params['search'] = params.pop('nome')
    headers = {
        "Authorization": f"Bearer {token}"
    }

    url_api_externa = "https://api.tisaude.com/api/patients"

    try:
        response = requests.get(url_api_externa, params=params, headers=headers)
        response.raise_for_status()  

        dados = response.json()

        items = dados.get("data") if isinstance(dados, dict) and "data" in dados else dados

        patients = [
            {
                "id": p.get("id"),
                "name": p.get("name"),
                "cpf": p.get("cpf"),
                "healthInsurance": p.get("healthInsurance", {}).get("name") if p.get("healthInsurance") else None
            }
            for p in (items or [])
        ]

        return jsonify({"patients": patients}), 200  

    except requests.exceptions.RequestException as e:
        return jsonify({"erro": str(e)}), 500

app.register_blueprint(pacientes_bp)

if __name__ == '__main__':
    app.run(debug=True)
