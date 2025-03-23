FROM ubuntu:22.04

# Installer les dépendances système
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers
COPY . .

# Vérifier si tsconfig.json existe et lancer le build
RUN [ -f "tsconfig.json" ] && npm run build || echo "No build step needed"

# Exposer le port
EXPOSE 3000

# Ajouter une variable d'environnement pour le host
ENV HOST=0.0.0.0

# Démarrer l'application en mode dev
CMD ["npm", "start"]
