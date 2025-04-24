FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt update && \
    apt install -y curl gnupg nginx git && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt install -y nodejs && \
    apt clean && rm -rf /var/lib/apt/lists/*


WORKDIR /app


COPY package.json package-lock.json ./
COPY tsconfig.json ./
COPY postcss.config.js ./
COPY src/ ./src
COPY public ./public
COPY index.html ./index.html

RUN npm install

RUN npm run build

RUN cp ./index.html ./dist/index.html


COPY nginx/transcendence.conf /etc/nginx/sites-available/transcendence.conf
RUN rm /etc/nginx/sites-enabled/default && \
    ln -s /etc/nginx/sites-available/transcendence.conf /etc/nginx/sites-enabled/


RUN mkdir -p /var/www/transcendence/public && \
    cp -r dist/* /var/www/transcendence/ &&\
    cp -r public/* /var/www/transcendence/public/

EXPOSE 3000
# 🔧 Lier les logs à stdout/stderr
RUN ln -sf /dev/stdout /var/log/nginx/access.log && \
    ln -sf /dev/stderr /var/log/nginx/error.log
CMD ["nginx", "-g", "daemon off;"]
