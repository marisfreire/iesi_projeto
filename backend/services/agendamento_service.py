import requests

def agendamento_service(
    nome,
    nacionalidade,
    cpf,
    convenio,
    dataNascimento,
    celular,
    email,
    encaminhadoPor,
    cartaoSaude,
    data,
    local,
    agenda,
    horario,
    procedimento
):
    try:
        payload = {
            "nome": nome,
            "nacionalidade": nacionalidade,
            "cpf": cpf,
            "convenio": convenio,
            "dataNascimento": dataNascimento,
            "celular": celular,
            "email": email,
            "encaminhadoPor": encaminhadoPor,
            "cartaoSaude": cartaoSaude,
            "data": data,
            "local": local,
            "agenda": agenda,
            "horario": horario,
            "procedimento": procedimento
        }

        response = requests.post(
            "https://api.tisaude.com/api/schedule/new",
            json=payload
        )
        response.raise_for_status()
        return response.json()

    except requests.exceptions.RequestException:
        return {"error": "Não foi possível realizar o agendamento"}
