from flask import Flask, Blueprint, jsonify, request
import requests  
from services.async_publisher import publisher

app = Flask(__name__)
pacientes_bp = Blueprint('pacientes', __name__)

@pacientes_bp.route('/pacientes', methods=['GET'])
def listar_pacientes():
    # Tenta obter token do header Authorization: Bearer <token> ou do query param 'token'
    auth_header = request.headers.get("Authorization", "")
    token = auth_header.replace("Bearer ", "").strip() or request.args.get("token", "").strip()
    params = request.args.to_dict()
    
    if 'nome' in params:
        params['search'] = params.pop('nome')
    headers = {"Authorization": f"Bearer {token}"} if token else {}

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
                "healthInsurance": p.get("healthInsurance", {}).get("name") if p.get("healthInsurance") else None,
            }
            for p in (items or [])
        ]
        # Publica mensagem assíncrona sobre a consulta de pacientes
        try:
            publisher.send_message(
                {
                    "event": "patients.list",
                    "params": params,
                    "count": len(patients),
                },
                routing_key="patients.list",
            )
        except Exception as pub_err:
            # Não bloquear a resposta por falha na publicação
            print("Falha ao publicar mensagem de pacientes:", pub_err)

        return jsonify({"patients": patients}), 200

    except requests.exceptions.RequestException as e:
        # Tenta publicar erro também
        try:
            publisher.send_message(
                {
                    "event": "patients.list.error",
                    "params": params,
                    "error": str(e),
                },
                routing_key="patients.list.error",
            )
        except Exception as pub_err:
            print("Falha ao publicar erro de pacientes:", pub_err)
        return jsonify({"erro": str(e)}), 500

app.register_blueprint(pacientes_bp)

if __name__ == '__main__':
    app.run(debug=True)
