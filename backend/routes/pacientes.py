from flask import Flask, Blueprint, jsonify
import requests  

app = Flask(__name__)
pacientes_bp = Blueprint('pacientes', __name__)

@pacientes_bp.route('/pacientes', methods=['GET'])
def listar_pacientes():

    url_api_externa = "https://api.tisaude.com/api/patients?search=&healthinsurance=&professional=&cellphone=&sex=&email=&mother=&father=&neighborhood=&city=&state=&maritalStatus=&status="

    usuario = 71484688414
    senha = "Senhabonita123*"

    try:
        response = requests.get(url_api_externa, auth=(usuario, senha))
        response.raise_for_status()  

        dados = response.json()
        return jsonify(dados)  

    except requests.exceptions.RequestException as e:
        return jsonify({"erro": str(e)}), 500

app.register_blueprint(pacientes_bp)

if __name__ == '__main__':
    app.run(debug=True)
