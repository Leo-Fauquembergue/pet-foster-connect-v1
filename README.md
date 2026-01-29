# Famille d'Accueil Animaux - Monorepo

Application web de mise en relation entre refuges et familles d'accueil pour animaux.

## 📚 Table des matières

- [Stack Technique](#stack-technique)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Scripts disponibles](#scripts-disponibles)
- [Structure du projet](#structure-du-projet)
- [Base de données & Persistance](#base-de-données--persistance)
- [Documentation API (Swagger)](#documentation-api-swagger)
- [Workflow Git](#workflow-git)

## 🛠 Stack Technique

- **Backend**: NestJS + TypeScript + Prisma + PostgreSQL
- **Frontend**: React + TypeScript + Tailwind CSS + Vite
- **Monorepo**: npm workspaces
- **Documentation API**: Swagger/OpenAPI

## 📋 Prérequis

- Node.js >= 18
- npm >= 9
- Docker & Docker Compose
- Port PostgreSQL : 5440
- Port Backend : 3001
- Port Frontend : 5173

## 🚀 Installation

### 1. Cloner le repository

```bash
git clone <url>
cd projet
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Lancer la base de données PostgreSQL

```bash
docker-compose up -d
```

> ℹ️ La base de données est exposée sur le port **5440** pour éviter les conflits avec d'éventuelles instances PostgreSQL locales (port 5432 par défaut).

### 4. Configurer les variables d'environnement

```bash
cp apps/backend/.env.example apps/backend/.env
# Éditer apps/backend/.env si nécessaire
```

Exemple de configuration dans `apps/backend/.env` :

```env
DATABASE_URL="postgresql://johndoe:randompassword@localhost:5440/petfosterconnect?schema=public"
PORT=3001
```

### 5. Initialiser Prisma

#### a. Installer les dépendances de configuration Prisma 7

```bash
cd apps/backend
npm install --save-dev dotenv @prisma/config
```

#### b. Lancer la migration (création des tables)

```bash
NODE_CONFIG_STRATEGY=none npx prisma migrate dev --name init_db --schema=./prisma/schema.prisma
```

#### c. Générer le client Prisma

```bash
npx prisma generate --schema=./prisma/schema.prisma
```

### 6. Lancer le projet en mode développement

```bash
# Depuis la racine du projet
npm run dev
```

Accès aux services :

- **Backend API**: http://localhost:3001
- **Frontend**: http://localhost:5173
- **Documentation Swagger**: http://localhost:3001/api

## 📜 Scripts disponibles

### Scripts globaux (depuis la racine)

```bash
npm run dev              # Lance backend + frontend en parallèle
npm run dev:backend      # Lance uniquement le backend
npm run dev:frontend     # Lance uniquement le frontend
npm run build            # Build complet du projet
```

### Scripts Docker

```bash
npm run docker:up        # Démarre PostgreSQL (Docker)
npm run docker:down      # Arrête PostgreSQL
```

### Scripts Prisma

```bash
npm run prisma:generate  # Génère le client Prisma
npm run prisma:migrate   # Applique les migrations
npm run prisma:studio    # Ouvre Prisma Studio (interface graphique)
```

Pour Prisma Studio :

```bash
cd apps/backend
npx prisma studio --config=./prisma.config.ts
```

## 📁 Structure du projet

```
projet/
├── apps/
│   ├── backend/          # API NestJS
│   │   ├── src/
│   │   │   ├── animals/
│   │   │   ├── applications/
│   │   │   ├── auth/
│   │   │   ├── bookmarks/
│   │   │   ├── email/
│   │   │   ├── shelters/
│   │   │   ├── species/
│   │   │   ├── users/
│   │   │   └── main.ts   # Configuration Swagger
│   │   └── prisma/
│   │       └── schema.prisma
│   └── frontend/         # Application React
│       └── src/
├── packages/
│   └── shared-types/     # Types TypeScript partagés
├── docker-compose.yml
└── package.json
```

## 🗄️ Base de données & Persistance

Le backend utilise **NestJS**, **Prisma 7** et **PostgreSQL** (via Docker). L'architecture est conçue pour être isolée et facile à reproduire.

### Configuration PostgreSQL

- **Port** : 5440
- **Database** : petfosterconnect
- **User** : johndoe
- **Password** : randompassword

### Commandes Prisma utiles

```bash
# Créer une nouvelle migration
NODE_CONFIG_STRATEGY=none npx prisma migrate dev --name nom_migration --schema=./prisma/schema.prisma

# Appliquer les migrations en production
npx prisma migrate deploy --schema=./prisma/schema.prisma

# Réinitialiser la base de données (⚠️ supprime toutes les données)
npx prisma migrate reset --schema=./prisma/schema.prisma

# Visualiser la base de données
npx prisma studio --config=./prisma.config.ts
```

## 📖 Documentation API (Swagger)

L'API est entièrement documentée avec **Swagger/OpenAPI**. Une interface interactive permet de tester tous les endpoints directement depuis le navigateur.

### Accès à la documentation

Une fois le backend lancé, accédez à :

```
http://localhost:3001/api
```

### Fonctionnalités Swagger

- ✅ Documentation complète de tous les endpoints
- ✅ Schémas de requêtes et réponses
- ✅ Testeur d'API intégré (essayer les requêtes directement)
- ✅ Authentification JWT intégrée
- ✅ Organisation par tags (modules)

### Tags disponibles

| Tag            | Description                      |
| -------------- | -------------------------------- |
| `animals`      | Gestion des animaux              |
| `applications` | Gestion des demandes d'adoption  |
| `auth`         | Authentification et autorisation |
| `bookmarks`    | Gestion des favoris              |
| `emails`       | Envoi d'emails                   |
| `shelters`     | Gestion des refuges              |
| `species`      | Liste des espèces                |
| `users`        | Gestion des utilisateurs         |
| `health`       | État de santé de l'API           |

### Tester l'API avec Swagger

1. Accédez à http://localhost:3001/api
2. Pour les routes protégées, cliquez sur le bouton **"Authorize"** 🔒
3. Entrez votre token JWT (récupéré via `/auth/login`)
4. Testez les endpoints directement dans l'interface

### Exemple : Authentification

```bash
# 1. S'inscrire
POST /auth/register
Body: { "email": "test@example.com", "password": "password123", ... }

# 2. Se connecter
POST /auth/login
Body: { "email": "test@example.com", "password": "password123" }
Response: { "access_token": "eyJhbGc..." }

# 3. Utiliser le token dans Swagger
Cliquez sur "Authorize" et collez le token
```

## 🔄 Workflow Git

### 1. Créer une branche depuis `main`

```bash
git checkout main
git pull origin main
git checkout -b feature/nom-feature
```

### 2. Développer et commit

```bash
git add .
git commit -m "feat: description de la fonctionnalité"
```

**Convention de commit** :

- `feat:` Nouvelle fonctionnalité
- `fix:` Correction de bug
- `docs:` Documentation
- `style:` Formatage, pas de changement de code
- `refactor:` Refactoring
- `test:` Ajout de tests
- `chore:` Tâches de maintenance

### 3. Push et créer une Pull Request

```bash
git push origin feature/nom-feature
```

Puis créez une Pull Request sur GitHub/GitLab.

## 🐛 Dépannage

### La base de données ne démarre pas

```bash
# Vérifier les logs Docker
docker-compose logs postgres

# Arrêter et redémarrer
npm run docker:down
npm run docker:up
```

### Erreur Prisma "Client not generated"

```bash
cd apps/backend
npx prisma generate --schema=./prisma/schema.prisma
```

### Port déjà utilisé

Si le port 3001 ou 5173 est déjà utilisé, modifiez les fichiers de configuration :

- Backend : `apps/backend/.env` → `PORT=3002`
- Frontend : `apps/frontend/vite.config.ts` → `server: { port: 5174 }`

### Swagger ne s'affiche pas

Vérifiez que :

1. Le backend est bien lancé sur http://localhost:3001
2. Vous accédez bien à http://localhost:3001/api (et non /api-docs)
3. Les décorateurs `@ApiTags()` sont bien présents dans vos contrôleurs
