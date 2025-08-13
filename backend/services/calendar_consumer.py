import json
import threading
import pika
from typing import Dict, Any
from .calendario_service import fetch_calendario
from .cache import calendar_cache_set


class CalendarConsumer:
    def __init__(self):
        self.connection_params = pika.ConnectionParameters(
            host="localhost",
            port=5672,
            credentials=pika.PlainCredentials("guest", "guest")
        )
        self.exchange = "data_exchange"
        self.exchange_type = "direct"
        self.routing_key = "calendar.load"
        self.queue_name = "calendar_load_queue"

        t = threading.Thread(target=self._consume, daemon=True)
        t.start()

    def _consume(self):
        connection = pika.BlockingConnection(self.connection_params)
        channel = connection.channel()

        channel.exchange_declare(exchange=self.exchange, exchange_type=self.exchange_type, durable=True)
        channel.queue_declare(queue=self.queue_name, durable=True)
        channel.queue_bind(exchange=self.exchange, queue=self.queue_name, routing_key=self.routing_key)

        def on_message(ch, method, properties, body):
            try:
                data = json.loads(body)
                print(f"[CalendarConsumer] Recebido: {data}")
                token = data.get("token")
                date = data.get("date")
                params = {
                    "idCalendar": data.get("idCalendar"),
                    "idLocal": data.get("idLocal", ""),
                    "cbo": data.get("cbo", ""),
                    "status": data.get("status", ""),
                    "namePatient": data.get("namePatient", "")
                }

                # Dispara a coleta do calendário (resultados poderiam ser armazenados em cache/persistidos)
                if token and date and params.get("idCalendar"):
                    resultado = fetch_calendario(token=token, data=date, params=params)
                    params_for_cache = {**params, "__token": token}
                    calendar_cache_set(date, params_for_cache, resultado)
                else:
                    print("[CalendarConsumer] Mensagem sem dados suficientes para processar calendário")
            except Exception as e:
                print("[CalendarConsumer] Erro ao processar mensagem:", e)
            finally:
                ch.basic_ack(delivery_tag=method.delivery_tag)

        channel.basic_qos(prefetch_count=1)
        channel.basic_consume(queue=self.queue_name, on_message_callback=on_message, auto_ack=False)
        print("[CalendarConsumer] Aguardando mensagens...")
        channel.start_consuming()


# Instância global para iniciar o consumidor em background
calendar_consumer = CalendarConsumer()
