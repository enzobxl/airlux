import redis
import requests
import time
import os

# Configuration
REDIS_HOST = os.getenv('REDIS_HOST', 'localhost')
REDIS_PORT = int(os.getenv('REDIS_PORT', 6379))
VICTORIA_URL = os.getenv('VICTORIA_URL', 'http://<serveur>:8428/api/v1/import')

def is_victoria_available():
    """Vérifie si VictoriaMetrics est accessible."""
    try:
        response = requests.get(VICTORIA_URL, timeout=5)
        return response.status_code == 200
    except requests.RequestException:
        return False

def fetch_and_send_data():
    try:
        # Connexion à Redis
        redis_client = redis.StrictRedis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)

        # Vérifier la connectivité à VictoriaMetrics
        if not is_victoria_available():
            print("VictoriaMetrics is unavailable. Retrying later...")
            return

        # Obtenir toutes les clés de Redis
        keys = redis_client.keys('*')
        if not keys:
            print("No data in Redis to send.")
            return

        # Préparer les données à envoyer
        metric_data = []
        for key in keys:
            value = redis_client.get(key)

            # Vérifier si la valeur est un nombre
            try:
                value = float(value)
            except ValueError:
                print(f"Skipping non-numeric value for key: {key} (value: {value})")
                continue

            metric_data.append({
                "metric": "example_metric",
                "timestamp": int(time.time()),
                "value": value,
                "labels": {
                    "key": key
                }
            })

        # Envoyer les données à VictoriaMetrics
        response = requests.post(VICTORIA_URL, json=metric_data)

        if response.status_code == 200:
            print(f"Data sent successfully. Clearing Redis cache...")
            # Supprimer toutes les clés de Redis après un envoi réussi
            redis_client.flushdb()
        else:
            print(f"Failed to send data to VictoriaMetrics. Response: {response.text}")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    fetch_and_send_data()
