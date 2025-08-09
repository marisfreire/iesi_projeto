from flask import Blueprint, request, jsonify
from services.agendamento_service import agendamento_service

agendamento_bp = Blueprint("agendamento", __name__)

@agendamento_bp.route("/agendamento", methods=["POST"])
def agendamento():
    try:
        data = request.get_json()

        nome = data["nome"]
        nacionalidade = data["nacionalidade"]
        cpf = data["cpf"]
        convenio = data["convenio"]
        dataNascimento = data["dataNascimento"]
        celular = data["celular"]
        email = data["email"]
        encaminhadoPor = data["encaminhadoPor"]
        cartaoSaude = data["cartaoSaude"]
        data_agenda = data["data"]
        local = data["local"]
        agenda = data["agenda"]
        horario = data["horario"]
        procedimento = data["procedimento"]

        result = agendamento_service(
            nome,
            nacionalidade,
            cpf,
            convenio,
            dataNascimento,
            celular,
            email,
            encaminhadoPor,
            cartaoSaude,
            data_agenda,
            local,
            agenda,
            horario,
            procedimento
        )

        return jsonify(result), 200

    except KeyError as e:
        return jsonify({"error": f"Campo ausente: {e}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500
