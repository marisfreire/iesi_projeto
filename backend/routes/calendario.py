from flask import Blueprint, jsonify, request
from services.calendario_service import fetch_calendario
from services.cache import calendar_cache_get, calendar_cache_set

calendario_bp = Blueprint("calendario", __name__)

@calendario_bp.route("/calendario", methods=["GET"])
def get_calendario():
    token = request.headers.get("Authorization", "").replace("Bearer ", "") or request.args.get("token", "")
    data = request.args.get("data")  # formato YYYY-MM-DD
    id_calendar = request.args.get("idCalendar")

    if not data or not id_calendar:
        return jsonify({"erro": "Parâmetros 'data' e 'idCalendar' são obrigatórios"}), 400
    if not token:
        return jsonify({"erro": "Token ausente no header Authorization"}), 401

    params = {
        "idCalendar": id_calendar,
        "idLocal": request.args.get("idLocal", ""),
        "cbo": request.args.get("cbo", ""),
        "status": request.args.get("status", ""),
        "namePatient": request.args.get("namePatient", "")
    }

    # inclui o token no escopo do cache para evitar vazamento entre identidades
    params_for_cache = {**params, "__token": token}

    try:
        cached = calendar_cache_get(data, params_for_cache)
        if cached is not None:
            return jsonify(cached)

        resultado = fetch_calendario(token=token, data=data, params=params)
        calendar_cache_set(data, params_for_cache, resultado)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({"erro": str(e)}), 500
