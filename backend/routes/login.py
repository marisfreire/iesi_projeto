from flask import Blueprint, request, jsonify
from services.login_service import login_service

login_bp = Blueprint('login', __name__)

@login_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    print("🔧 Dados recebidos na rota /login:", data)

    username = data.get('username')
    senha = data.get('senha')

    if not username or not senha:
        return jsonify({"error": "Nome de usuario e senha obrigatórios"}), 400

    result = login_service(username, senha)

    if "error" in result:
        return jsonify(result), 401

    return jsonify(result), 200

