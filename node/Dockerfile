# Image de base officielle Node.js, version identifiée
FROM node:24-alpine

LABEL org.opencontainers.image.title="API Livres"
LABEL org.opencontainers.image.version="1.0.0"
LABEL org.opencontainers.image.description="Atelier Node.js Express MongoDB"

# Répertoire de travail du conteneur
WORKDIR /app

# Installation des dépendances
COPY package*.json ./
RUN npm install --omit=dev --no-audit --no-fund

# Copie du code de l'application
COPY . .

EXPOSE 3000
USER node
CMD ["node", "server.js"]
