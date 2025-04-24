# GATEWAY DOCKERFILE

# Étape 1 : Build avec TypeScript
FROM node:18-bullseye-slim AS builder

# Installer dépendances système nécessaires
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copier les fichiers essentiels
COPY package.json package-lock.json tsconfig.json ./

# Installer les dépendances
RUN npm install --legacy-peer-deps
RUN npm install typescript

# Copier le reste du projet
COPY . .

# Compiler le TypeScript
RUN npx tsc


# Étape 2 : Image de production
FROM node:18-bullseye-slim

# Installer SQLite uniquement (pas besoin de tout le toolchain)
RUN apt-get update && apt-get install -y \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copier uniquement les fichiers nécessaires pour exécution
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Monter un volume pour la base SQLite
# Une fois la methode API installee, effacer les volumes

# Définir la variable d’environnement
ENV PORT=5000

# Exposer le port Fastify
EXPOSE 5000

# Démarrer le serveur
CMD ["node", "dist/main.js"]
