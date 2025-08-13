import pika
import json
import threading
from queue import Queue

class AsyncRabbitmqPublisher:
    def __init__(self):
        self.queue = Queue()
        self.connection_params = pika.ConnectionParameters(
            host="localhost",
            port=5672,
            credentials=pika.PlainCredentials("guest", "guest")
        )
        self.exchange = "data_exchange"
        self.exchange_type = "direct"

        t = threading.Thread(target=self._worker, daemon=True)
        t.start()

    def _worker(self):
        connection = pika.BlockingConnection(self.connection_params)
        channel = connection.channel()
        channel.exchange_declare(exchange=self.exchange, exchange_type=self.exchange_type, durable=True)

        while True:
            routing_key, body = self.queue.get()
            channel.basic_publish(
                exchange=self.exchange,
                routing_key=routing_key,
                body=json.dumps(body),
                properties=pika.BasicProperties(delivery_mode=2)
            )
            print(f"[AsyncPublisher] Sent: {body}")
            self.queue.task_done()

    def send_message(self, body, routing_key: str = ""):
        self.queue.put((routing_key, body))

# Instância global reutilizável
publisher = AsyncRabbitmqPublisher()
