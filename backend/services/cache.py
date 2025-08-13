from typing import Any, Dict, Tuple

# Cache simples em memória para o calendário
_calendar_cache: Dict[Tuple[str, str, str, str, str, str], Any] = {}


def calendar_cache_key(date: str, params: Dict[str, str]):
    # Inclui opcionalmente o token na chave, se presente (como __token em params)
    return (
        date,
        params.get("idCalendar", ""),
        params.get("idLocal", ""),
        params.get("cbo", ""),
        params.get("status", ""),
        params.get("namePatient", ""),
        params.get("__token", ""),
    )


def calendar_cache_get(date: str, params: Dict[str, str]):
    return _calendar_cache.get(calendar_cache_key(date, params))


def calendar_cache_set(date: str, params: Dict[str, str], value: Any):
    _calendar_cache[calendar_cache_key(date, params)] = value
