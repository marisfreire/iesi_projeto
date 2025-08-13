import calendar
import requests
from typing import Dict, List, Any


def _format_item(item: Dict[str, Any]) -> Dict[str, str]:
    paciente = item.get("patient", {})
    nome = paciente.get("name", "Paciente Sem Nome")

    data_api = item.get("date", "")
    if data_api:
        ano_, mes_, dia_ = data_api.split("-")
        data_formatada = f"{dia_}/{mes_}/{ano_}"
    else:
        data_formatada = ""

    hora = (item.get("hour", "") or "") + ":00"

    return nome, {
        "dateSchedule": data_formatada,
        "hour": hora
    }


def fetch_calendario(token: str, data: str, params: Dict[str, str]) -> List[Dict[str, Any]]:
    try:
        ano, mes, _ = map(int, data.split("-"))
    except ValueError:
        raise ValueError("Data inválida, use formato YYYY-MM-DD")

    _, ultimo_dia = calendar.monthrange(ano, mes)

    headers = {"Authorization": f"Bearer {token}"}

    agrupado: Dict[str, List[Dict[str, str]]] = {}

    for dia in range(1, ultimo_dia + 1):
        data_atual = f"{ano}-{mes:02d}-{dia:02d}"
        api_url = f"https://api.tisaude.com/api/schedule/{data_atual}"
        r = requests.get(api_url, params=params, headers=headers, timeout=10)
        r.raise_for_status()
        dados = r.json()

        for item in dados.get("data", []):
            nome, payload = _format_item(item)
            if nome not in agrupado:
                agrupado[nome] = []
            agrupado[nome].append(payload)

    return [{"name": nome, "schedule": agendamentos} for nome, agendamentos in agrupado.items()]
