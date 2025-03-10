FROM python:3.11

# Installer le client MySQL pour tester la connexion à MariaDB
RUN apt-get update && apt-get install -y default-mysql-client && rm -rf /var/lib/apt/lists/*
RUN pip install gunicorn

WORKDIR /app
COPY . .
# Donner les permissions d'exécution au script wait-for-db.sh
RUN chmod +x /app/wait-for-db.sh

RUN pip install --no-cache-dir -r requirements.txt
EXPOSE 8000
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "pingpong_backend.wsgi:application"]
