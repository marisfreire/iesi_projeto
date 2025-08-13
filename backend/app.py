from flask import Flask
from flask_cors import CORS
from routes.login import login_bp
from routes.agendamento import agendamento_bp 
from routes.pacientes import pacientes_bp 

app = Flask(__name__)
CORS(app)

app.register_blueprint(login_bp)
app.register_blueprint(agendamento_bp)
app.register_blueprint(pacientes_bp)

if __name__ == '__main__':
    app.run(debug=True)
