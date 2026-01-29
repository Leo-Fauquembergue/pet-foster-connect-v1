# --- 1. BUILDER ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copier les fichiers de config globaux
COPY package*.json ./
COPY biome.json ./

# Copier les sous-projets
COPY apps/backend/package*.json ./apps/backend/
COPY apps/frontend/package*.json ./apps/frontend/
COPY packages/shared-types/package*.json ./packages/shared-types/

# Installer les dépendances (tout le monorepo)
RUN npm install

# Copier tout le code source
COPY . .

# Générer le client Prisma (Backend)
WORKDIR /app/apps/backend
RUN npx prisma generate

# Construire le Backend
RUN npm run build

# --- 2. RUNNER (Image de production légère) ---
FROM node:20-alpine

WORKDIR /app

# Copier les dépendances et le build depuis le builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/backend ./apps/backend

# Variables d'environnement par défaut
ENV NODE_ENV=production
ENV PORT=3000

# Se placer dans le backend pour lancer la commande
WORKDIR /app/apps/backend

EXPOSE 3000

# Lancer le script start:prod
CMD ["npm", "run", "start:prod"]