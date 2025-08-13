from flask import Blueprint, jsonify, request
import calendar
import requests
from requests.auth import HTTPBasicAuth

calendario_bp = Blueprint("calendario", __name__)

USUARIO = "71484688414"
SENHA = "Senhabonita123*"

@calendario_bp.route("/calendario", methods=["GET"])
def get_calendario():
    token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FwaS50aXNhdWRlLmNvbSIsImlhdCI6MTc1NTAxMjI0OCwiZXhwIjoxNzU3NjA0MjQ4LCJuYmYiOjE3NTUwMTIyNDgsImp0aSI6IkNNRTFXVHJOSFBOZWZHamgiLCJzdWIiOiI4Nzg4NSIsInBydiI6IjU4NzA4NjNkNGE2MmQ3OTE0NDNmYWY5MzZmYzM2ODAzMWQxMTBjNGYifQ.XT_qpWzgM-enSuBgdUOJ8WrhPk84YLtQ5B2UKcRGG1Y"
    data = request.args.get("data")  # formato YYYY-MM-DD
    id_calendar = request.args.get("idCalendar")

    if not data or not id_calendar:
        return jsonify({"erro": "Parâmetros 'data' e 'idCalendar' são obrigatórios"}), 400

    try:
        ano, mes, _ = map(int, data.split("-"))
    except ValueError:
        return jsonify({"erro": "Data inválida, use formato YYYY-MM-DD"}), 400

    _, ultimo_dia = calendar.monthrange(ano, mes)

    headers = {
        "Authorization": f"Bearer {token}"
    }
    params = {
        "idCalendar": id_calendar,
        "idLocal": request.args.get("idLocal", ""),
        "cbo": request.args.get("cbo", ""),
        "status": request.args.get("status", ""),
        "namePatient": request.args.get("namePatient", "")
    }

    agrupado = {}
    try:
        for dia in range(1, ultimo_dia + 1):
            data_atual = f"{ano}-{mes:02d}-{dia:02d}"
            api_url = f"https://api.tisaude.com/api/schedule/{data_atual}"
            r = requests.get(api_url, params=params, headers=headers, timeout=10)
            r.raise_for_status()
            dados = r.json()

            for item in dados.get("data", []):
                paciente = item.get("patient", {})
                nome = paciente.get("name", "Paciente Sem Nome")

                data_api = item.get("date", "")
                if data_api:
                    ano_, mes_, dia_ = data_api.split("-")
                    data_formatada = f"{dia_}/{mes_}/{ano_}"
                else:
                    data_formatada = ""

                hora = item.get("hour", "") + ":00"

                if nome not in agrupado:
                    agrupado[nome] = []

                agrupado[nome].append({
                    "dateSchedule": data_formatada,
                    "hour": hora
                })

        resultado = [{"name": nome, "schedule": agendamentos} for nome, agendamentos in agrupado.items()]
        return jsonify(resultado)

    except requests.exceptions.RequestException as e:
        return jsonify({"erro": str(e)}), 500
