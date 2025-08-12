from flask import Blueprint, jsonify
import requests
from requests.auth import HTTPBasicAuth

calendario_bp = Blueprint("calendario", __name__)

API_URL = "https://api.tisaude.com/api/schedule/2024-12-18"
PARAMS = {
    "idCalendar": 1,
    "idLocal": "",
    "cbo": "",
    "status": "",
    "namePatient": ""
}

USUARIO = "71484688414" 
SENHA = "Senhabonita123*"    

@calendario_bp.route("/calendario", methods=["GET"])
def get_calendario():
    try:
        r = requests.get(
            API_URL,
            params=PARAMS,
            auth=HTTPBasicAuth(USUARIO, SENHA),
            timeout=10
        )
        r.raise_for_status()
        dados = r.json()
        return jsonify(dados)
    except requests.exceptions.RequestException as e:
        return jsonify({"erro": str(e)}), 500
