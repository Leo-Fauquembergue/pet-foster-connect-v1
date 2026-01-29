#!/bin/bash

# 1. URL de la base de test
export DATABASE_URL="postgresql://postgres:postgres@localhost:5440/petfoster_test?schema=public"

echo "🛠  Préparation de la base de données de test..."

# 2. Créer la DB si elle n'existe pas
docker exec petfosterconnect-db psql -U postgres -c "CREATE DATABASE petfoster_test;" 2>/dev/null || true

# 3. Pousser le schéma Prisma
# npx prisma db push --schema=apps/backend/prisma/schema.prisma --accept-data-loss
npx prisma db push --schema=apps/backend/prisma/schema.prisma --accept-data-loss

echo "✅ Base de données prête. Lancement des tests..."

# 4. LANCER JEST (La ligne manquante)
npx jest --config apps/backend/test/jest-e2e.json

# commande à lancer sanbs ce script
# "test:e2e": "dotenv -e apps/backend/.env.test -- jest --config apps/backend/test/jest-e2e.json"