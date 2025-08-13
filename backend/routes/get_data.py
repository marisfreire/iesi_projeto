from flask import Blueprint, request, jsonify
import requests
from services.async_publisher import publisher

get_data_bp = Blueprint('get_data', __name__)

ALLOWED_RESOURCES = {"pacientes", "paciente", "ehr_tabs", "ehr_list", "ehr_doc"}


@get_data_bp.route('/get_data', methods=['GET'])
def get_data():
    resource = request.args.get('resource')
    if resource not in ALLOWED_RESOURCES:
        return jsonify({"error": "Recurso não permitido"}), 400

    # Token do header Authorization: Bearer <token> ou query param 'token'
    auth_header = request.headers.get("Authorization", "")
    token = auth_header.replace("Bearer ", "").strip() or request.args.get("token", "").strip()
    headers = {"Authorization": f"Bearer {token}"} if token else {}

    try:
        if resource == 'pacientes':
            params = request.args.to_dict()
            params.pop('resource', None)
            if 'nome' in params:
                params['search'] = params.pop('nome')

            url_api_externa = "https://api.tisaude.com/api/patients"
            r = requests.get(url_api_externa, params=params, headers=headers, timeout=15)
            r.raise_for_status()
            dados = r.json()

            items = dados.get("data") if isinstance(dados, dict) and "data" in dados else dados
            patients = [
                {
                    "id": p.get("id"),
                    "name": p.get("name"),
                    "cpf": p.get("cpf"),
                    "cellphone": p.get("cellphone"),
                    "dateOfBirth": p.get("dateOfBirth"),
                    "email": p.get("email"),
                    "healthInsurance": p.get("healthInsurance", {}).get("name") if p.get("healthInsurance") else None,
                }
                for p in (items or [])
            ]
            try:
                publisher.send_message(
                    {"event": "get_data.pacientes.success", "params": params, "count": len(patients)},
                    routing_key="patients.list",
                )
            except Exception:
                pass
            return jsonify({"patients": patients})

        elif resource == 'paciente':
            patient_id = request.args.get('id')
            if not patient_id:
                return jsonify({"error": "Parâmetro 'id' é obrigatório"}), 400
            url = f"https://api.tisaude.com/api/patients/{patient_id}"
            r = requests.get(url, headers=headers, timeout=15)
            r.raise_for_status()
            data = r.json()
            try:
                publisher.send_message(
                    {"event": "get_data.paciente.success", "id": patient_id, "name": data.get("name")},
                    routing_key="ehr.patient",
                )
            except Exception:
                pass
            return jsonify(data)

        elif resource == 'ehr_tabs':
            patient_id = request.args.get('id')
            if not patient_id:
                return jsonify({"error": "Parâmetro 'id' é obrigatório"}), 400
            params = {"id": patient_id, "onlyTab": request.args.get('onlyTab', '0')}
            url = "https://api.tisaude.com/api/ehr/tabs"
            r = requests.get(url, headers=headers, params=params, timeout=15)
            r.raise_for_status()
            arr = r.json()
            try:
                publisher.send_message(
                    {"event": "get_data.ehr_tabs.success", "id": patient_id, "count": len(arr) if isinstance(arr, list) else 0},
                    routing_key="ehr.tabs",
                )
            except Exception:
                pass
            return jsonify(arr)

        elif resource == 'ehr_list':
            patient_id = request.args.get('id')
            tab = request.args.get('tab')
            if not patient_id or not tab:
                return jsonify({"error": "Parâmetros 'id' e 'tab' são obrigatórios"}), 400
            url = f"https://api.tisaude.com/api/patients/{patient_id}/ehr/list"
            r = requests.get(url, headers=headers, params={"tab": tab}, timeout=15)
            r.raise_for_status()
            lst = r.json()
            try:
                publisher.send_message(
                    {"event": "get_data.ehr_list.success", "id": patient_id, "tab": tab, "count": len(lst) if isinstance(lst, list) else 0},
                    routing_key="ehr.list",
                )
            except Exception:
                pass
            return jsonify(lst)

        elif resource == 'ehr_doc':
            patient_id = request.args.get('id')
            tab = request.args.get('tab')
            doc_id = request.args.get('docId')
            history = request.args.get('history', '0')
            if not patient_id or not tab or not doc_id:
                return jsonify({"error": "Parâmetros 'id', 'tab' e 'docId' são obrigatórios"}), 400
            url = f"https://api.tisaude.com/api/patients/{patient_id}/ehr/documenhistory/{tab}/{doc_id}"
            r = requests.get(url, headers=headers, params={"history": history}, timeout=15)
            r.raise_for_status()
            doc = r.json()
            try:
                title = None
                if isinstance(doc, dict):
                    title = (doc.get("ehrActual") or {}).get("title") or doc.get("name")
                publisher.send_message(
                    {"event": "get_data.ehr_doc.success", "id": patient_id, "tab": tab, "docId": doc_id, "title": title},
                    routing_key="ehr.doc",
                )
            except Exception:
                pass
            return jsonify(doc)

        else:
            return jsonify({"error": "Recurso não implementado"}), 400

    except requests.exceptions.RequestException as e:
        # tenta publicar erro genérico do get_data
        try:
            publisher.send_message(
                {"event": f"get_data.{request.args.get('resource')}.error", "params": request.args.to_dict(), "error": str(e)},
                routing_key="get_data.error",
            )
        except Exception:
            pass
        return jsonify({"error": str(e)}), 500
