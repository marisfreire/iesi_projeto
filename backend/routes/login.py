from flask import Blueprint, request, jsonify
from services.login_service import login_service
from services.async_publisher import publisher
from datetime import datetime

login_bp = Blueprint('login', __name__)

@login_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    print("Dados recebidos na rota /login:", data)

    username = data.get('username')
    senha = data.get('senha')
    user_type = data.get('userType')

    if not username or not senha:
        return jsonify({"error": "Nome de usuario e senha obrigatórios"}), 400

    result = login_service(username, senha)

    if "error" in result:
        return jsonify(result), 401

    # Publica mensagem para carregar calendário de forma assíncrona ao efetuar login
    try:
        # Supondo que o token venha do resultado do login
        token = result.get("token") or result.get("accessToken") or result.get("data", {}).get("token")
        if user_type == 'docente':
            # Valores padrão/placeholder; o frontend atualmente consome idCalendar fixo 236
            first_day = datetime.now().replace(day=1)
            date_str = first_day.strftime("%Y-%m-%d")
            payload = {
                "event": "load_calendar",
                "token": token,
                "idCalendar": 236,
                "date": date_str,
                # Parâmetros adicionais podem ser ajustados conforme necessário
                "idLocal": "",
                "cbo": "",
                "status": "",
                "namePatient": ""
            }
            publisher.send_message(payload, routing_key="calendar.load")
    except Exception as pub_err:
        # Não bloquear o login por falha na publicação
        print("Falha ao publicar carga de calendário:", pub_err)

    return jsonify(result), 200

