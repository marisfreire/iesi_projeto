import requests

def agendamento_service(
    name,
    schedule
):
    try:
        payload = {
            "name": name,
            "schedule": schedule
        }

        token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FwaS50aXNhdWRlLmNvbSIsImlhdCI6MTc1NTAxMjI0OCwiZXhwIjoxNzU3NjA0MjQ4LCJuYmYiOjE3NTUwMTIyNDgsImp0aSI6IkNNRTFXVHJOSFBOZWZHamgiLCJzdWIiOiI4Nzg4NSIsInBydiI6IjU4NzA4NjNkNGE2MmQ3OTE0NDNmYWY5MzZmYzM2ODAzMWQxMTBjNGYifQ.XT_qpWzgM-enSuBgdUOJ8WrhPk84YLtQ5B2UKcRGG1Y"
        headers = {
            "Authorization": f"Bearer {token}",
        }

        print("Payload enviado:", payload)
        response = requests.post(
            "https://api.tisaude.com/api/schedule/new",
            json=payload,
            headers=headers
        )
        response.raise_for_status()
        return response.json()

    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP error: {http_err}")
        print(f"Response content: {response.text}")
        raise
    except requests.exceptions.RequestException as req_err:
        print(f"Request exception: {req_err}")
        raise