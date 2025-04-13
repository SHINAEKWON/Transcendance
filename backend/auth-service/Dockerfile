# # Utiliser Ubuntu comme base
# FROM ubuntu:22.04

# # Installer Node.js et npm
# RUN apt-get update \
#     && apt-get install -y curl \
#     && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
#     && apt-get install -y nodejs \
#     && apt-get install -y sqlite3 \
#     && apt-get clean

# # Définir le répertoire de travail
# # - https://www.geeksforgeeks.org/docker-workdir-instruction/
# #   WORKDIR instruction is used to set the working directory for all the 
# #   subsequent Dockerfile instructions.  Some frequently used instructions in a 
# #   Dockerfile are RUN, ADD, CMD, ENTRYPOINT, and COPY. If the WORKDIR is not 
# #   manually created, it gets created automatically -> we do not need to have
# #   the /app folder inside our project.
# WORKDIR /app

# # Copier package.json et package-lock.json pour optimiser le cache Docker
# # - with WORKDIR instruction, it will copy the files to /app in the container.
# COPY package*.json ./

# # Installer uniquement les dépendances nécessaires
# # - with WORKDIR, it runs in side the /app folder of the container.
# # - This command reads the package.json and package-lock.json files and 
# #   installs all dependencies listed in these files in the node_modules folder. 
# #   If the file package-lock.json exists, it will install the exact versions 
# #   listed in this package-lock.json file. If package-lock.json does not exist,
# #   it will install the most recent version in the version ranges listed in the 
# #   file package.json.
# # - From ChatGPT:
# #   The --legacy-peer-deps flag is used with the npm install command to 
# #   instruct npm to ignore peer dependency conflicts and install packages as if 
# #   it were an older version of npm.
# #   While --legacy-peer-deps can be useful to bypass errors, it should be used 
# #   with caution. Ignoring peer dependency conflicts might lead to Unresolved 
# #   Issues or Inconsistent Builds.
# # - TODO: SHOULD WE REMOVE THE --legacy-peer-deps FLAG ?
# RUN npm install --legacy-peer-deps

# # Installer Fastify 4 et @fastify/static compatible avec Fastify 4
# # - with WORKDIR, it runs in side the /app folder of the container.
# RUN npm install fastify@4 @fastify/static@6

# # Copier le reste du projet
# # - with WORKDIR instruction, it will copy the files to /app in the container.
# COPY . .

# VOLUME ["/app/data"]

# # Creation d'une base de donnee (test en cours)
# RUN mkdir -p /app/data && sqlite3 /app/data/user_db.sqlite ".databases"

# # Définir la variable d’environnement
# ENV PORT=3000

# # Exposer le port Fastify
# EXPOSE 3000

# # Démarrer le serveur
# CMD ["node", "index.js"]


#-----------------------------------------------------#

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
COPY package.json package-lock.json tsconfig.json ./

# Installer les dépendances
RUN npm install --legacy-peer-deps
RUN npm install typescript better-sqlite3

# Copier le reste du projet
COPY . .

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

# Monter un volume pour la base SQLite
VOLUME ["/app/data"]

# Définir la variable d’environnement
ENV PORT=3000

# Exposer le port Fastify
EXPOSE 3000

# Démarrer le serveur
CMD ["node", "dist/index.js"]
