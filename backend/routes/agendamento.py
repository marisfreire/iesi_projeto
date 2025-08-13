from flask import Blueprint, request, jsonify
from services.agendamento_service import agendamento_service
from services.async_publisher import publisher
import traceback

agendamento_bp = Blueprint("agendamento", __name__)

@agendamento_bp.route("/agendamento", methods=["POST"])
def agendamento():
    try:
        data = request.get_json()
        idPatient = data.get("idPatient")
        name = data.get("name")
        cpf = data.get("cpf")
        dateOfBirth = data.get("dateOfBirth")
        cellphone = data.get("cellphone")
        email = data.get("email")
        schedule = data.get("schedule")


        if not name:
            return jsonify({"error": "Campo obrigatório ausente: name"}), 400
        if not schedule or not isinstance(schedule, list) or len(schedule) == 0:
            return jsonify({"error": "Campo obrigatório ausente ou inválido: schedule"}), 400        

        result = agendamento_service(
            idPatient=idPatient, 
            name=name, 
            cpf=cpf, 
            dateOfBirth=dateOfBirth, 
            cellphone=cellphone, 
            email = email, 
            schedule=schedule
            )

        # Publica mensagem de novo agendamento (opcional, caso queira notificar outras partes)
        try:
            publisher.send_message({
                "event": "new_schedule",
                "idPatient": idPatient,
                "name": name,
                "cpf": cpf,
                "dateOfBirth": dateOfBirth,
                "cellphone": cellphone,
                "email": email,
                "schedule": schedule
            }, routing_key="schedule.new")
        except Exception as pub_err:
            print("Falha ao publicar novo agendamento:", pub_err)

        return jsonify(result), 200
    except Exception as e:
        print("Erro: ", str(e))
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    except KeyError as e:
        return jsonify({"error": f"Campo ausente: {e}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500
