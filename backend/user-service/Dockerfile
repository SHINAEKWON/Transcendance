# USER-SERVICE DOCKERFILE

# Étape 1 : Build avec TypeScript
FROM node:18-bullseye-slim AS builder

# Installer dépendances système nécessaires
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    sqlite3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copier les fichiers essentiels
COPY package.json tsconfig.json ./

# Installer les dépendances
RUN npm install --legacy-peer-deps
RUN npm install typescript better-sqlite3

# Copier le reste du projet
COPY src/ ./src
COPY uploads/ ./uploads

# Compiler le TypeScript
RUN npx tsc


# Étape 2 : Image de production
FROM node:18-bullseye-slim

# Installer SQLite uniquement (pas besoin de tout le toolchain)
RUN apt-get update && apt-get install -y sqlite3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copier uniquement les fichiers nécessaires pour exécution
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/uploads ./uploads
COPY --from=builder /app/src/.env .env

# Monter un volume pour la base SQLite

# VOLUME ["/app/data"]
VOLUME ["/app/uploads"]

# Définir la variable d’environnement
ENV PORT=4001

# Exposer le port Fastify
EXPOSE 4001

# Démarrer le serveur
CMD ["node", "dist/main.js"]