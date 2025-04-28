FROM node:22-alpine AS build

# Définir le répertoire de travail
# - https://www.geeksforgeeks.org/docker-workdir-instruction/
#   WORKDIR instruction is used to set the working directory for all the 
#   subsequent Dockerfile instructions.  Some frequently used instructions in a 
#   Dockerfile are RUN, ADD, CMD, ENTRYPOINT, and COPY. If the WORKDIR is not 
#   manually created, it gets created automatically -> we do not need to have
#   the /app folder inside our project.
WORKDIR /app

# Copier package.json et package-lock.json pour optimiser le cache Docker
# - with WORKDIR instruction, it will copy the files to /app in the container.
COPY package.json package-lock.json tsconfig.json ./

# Installer uniquement les dépendances nécessaires
# - with WORKDIR, it runs in side the /app folder of the container.
# - This command reads the package.json and package-lock.json files and 
#   installs all dependencies listed in these files in the node_modules folder. 
#   If the file package-lock.json exists, it will install the exact versions 
#   listed in this package-lock.json file. If package-lock.json does not exist,
#   it will install the most recent version in the version ranges listed in the 
#   file package.json.
RUN npm install

# Copier le reste du projet
# - with WORKDIR instruction, it will copy the files to /app in the container.
COPY public public/
COPY src src/
COPY styles styles/

RUN npm run build


FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/public /usr/share/nginx/html

COPY nginx.conf.template /etc/nginx/nginx.conf.template

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh


# "This container will listen for network connections on port 3000."
# It’s a hint to the person or system running the container.
# However, the port is not opened!
EXPOSE 3000

ENTRYPOINT ["/entrypoint.sh"]