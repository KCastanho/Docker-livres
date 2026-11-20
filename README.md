# Atelier Docker — API REST de gestion de livres

## Présentation du projet

Cet atelier consiste à développer et conteneuriser une API REST permettant de gérer une collection de livres.

L'application est développée avec **Node.js et Express**, et utilise **MongoDB** pour stocker les données.

L'ensemble fonctionne grâce à **Docker Compose**, qui permet de démarrer et faire communiquer les deux conteneurs.

### Technologies utilisées

- **Node.js 24** : environnement d'exécution JavaScript
- **Express 5** : framework pour créer l'API REST
- **MongoDB 8** : base de données NoSQL
- **Mongoose** : gestion des modèles et communication avec MongoDB
- **Docker** : conteneurisation de l'application
- **Docker Compose** : orchestration des conteneurs
- **Postman** : tests des requêtes HTTP
- **MongoDB Compass** : visualisation des données

## Structure du projet

```text
tp-api-livres/
├── node/
│   ├── models/
│   │   └── Book.js
│   ├── routes/
│   │   └── books.js
│   ├── server.js
│   ├── package.json
│   ├── Dockerfile
│   └── .dockerignore
├── compose.yml
├── .gitignore
└── README.md
```

Le dossier `mongo/` peut également exister localement, mais il n'est pas nécessaire au fonctionnement de l'application et n'apparaît pas sur GitHub s'il est vide.

### Description des principaux fichiers

| Fichier | Description |
|---|---|
| `server.js` | Initialisation du serveur Express et connexion à MongoDB |
| `models/Book.js` | Définition du schéma des livres |
| `routes/books.js` | Gestion des routes CRUD |
| `Dockerfile` | Construction de l'image Docker Node.js |
| `compose.yml` | Configuration des services Node.js et MongoDB |
| `.dockerignore` | Exclusion des fichiers inutiles lors de la construction |

## Installation et démarrage

### Prérequis

- Docker Desktop installé et démarré
- Git
- Postman (pour tester l'API)
- MongoDB Compass (pour visualiser les données, facultatif)

### 1. Récupérer le projet

```bash
git clone https://github.com/KCastanho/Docker-livres.git
cd Docker-livres
```

### 2. Vérifier la configuration Docker

```bash
docker compose config
```

### 3. Construire et démarrer les conteneurs

```bash
docker compose up -d --build
```

### 4. Vérifier leur fonctionnement

```bash
docker compose ps
```

Deux conteneurs doivent être actifs :

- `atelier-livres-node`
- `atelier-livres-mongo` (healthy)

### 5. Consulter les logs

```bash
docker compose logs api
```

Résultat attendu :

```text
Connecté à MongoDB
API disponible sur le port 3000
```

L'API est maintenant accessible aux adresses :

- http://localhost:3000/
- http://localhost:3000/books

## Modèle de données

Chaque livre possède les propriétés suivantes :

| Propriété | Type | Description |
|---|---|---|
| `id` | Number | Identifiant unique du livre |
| `title` | String | Titre du livre |
| `author` | String | Auteur du livre |
| `page` | Number | Nombre de pages |

Exemple :

```json
{
  "id": 1,
  "title": "Le Petit Prince",
  "author": "Antoine de Saint-Exupéry",
  "page": 96
}
```

MongoDB crée également un identifiant interne `_id`, qui n'est pas retourné dans les réponses de l'API.

## Routes de l'API REST

L'API propose cinq routes permettant de réaliser les opérations CRUD (Create, Read, Update, Delete).

| Méthode | Route | Description |
|---|---|---|
| GET | `/books` | Récupérer tous les livres |
| GET | `/books/:id` | Récupérer un livre par son ID |
| POST | `/books` | Ajouter un livre |
| PUT | `/books/:id` | Modifier un livre |
| DELETE | `/books/:id` | Supprimer un livre |

### GET — Récupérer tous les livres

```http
GET http://localhost:3000/books
```

Réponse : `200 OK`

### GET — Récupérer un livre

```http
GET http://localhost:3000/books/1
```

Réponse : `200 OK`, ou `404 Not Found` si le livre n'existe pas.

### POST — Ajouter un livre

```http
POST http://localhost:3000/books
```

Body JSON :

```json
{
  "id": 1,
  "title": "Le Petit Prince",
  "author": "Antoine de Saint-Exupéry",
  "page": 96
}
```

Réponse : `201 Created`.

### PUT — Modifier un livre

```http
PUT http://localhost:3000/books/1
```

Body JSON :

```json
{
  "title": "Le Petit Prince - Édition illustrée",
  "author": "Antoine de Saint-Exupéry",
  "page": 120
}
```

Réponse : `200 OK`.

### DELETE — Supprimer un livre

```http
DELETE http://localhost:3000/books/1
```

Réponse : `204 No Content`.

### Gestion des erreurs

L'API gère notamment les réponses suivantes :

- `400 Bad Request` : données ou identifiant invalides
- `404 Not Found` : livre introuvable
- `409 Conflict` : identifiant déjà utilisé
- `500 Internal Server Error` : erreur interne

## Configuration Docker

Le projet utilise un `Dockerfile` et un fichier `compose.yml`.

### Images Docker

- `atelier-livres-api:1.0.0` : image personnalisée de l'application Node.js
- `mongo:8.0` : image officielle MongoDB

### Conteneurs

- `atelier-livres-node`
- `atelier-livres-mongo`

### Réseau

Les deux conteneurs communiquent sur le réseau Docker :

`atelier-livres-network`

La connexion MongoDB utilisée par Node.js est :

```text
mongodb://mongo:27017/livresdb
```

Le nom `mongo` correspond au service défini dans Docker Compose.

### Ports

| Service | Port Mac | Port conteneur |
|---|---|---|
| API Node.js | 3000 | 3000 |
| MongoDB | 27018 | 27017 |

MongoDB utilise le port `27018` sur le Mac pour éviter un conflit avec une autre instance MongoDB utilisant déjà `27017`.

### Volume Docker

Un volume nommé `atelier-livres-data` est utilisé pour conserver les données MongoDB.

```yaml
volumes:
  - atelier-livres-data:/data/db
```

Cela permet de conserver les livres même après la suppression et la recréation des conteneurs.

## MongoDB Compass

Pour consulter la base de données, créer une connexion dans MongoDB Compass avec :

```text
mongodb://localhost:27018
```

La base utilisée est :

```text
livresdb
└── books
```

La collection `books` contient les documents enregistrés à travers l'API.

## Vérification de la persistance

Un test de persistance a été effectué pendant l'atelier.

1. Création d'un livre depuis Postman.
2. Vérification de sa présence dans MongoDB Compass.
3. Suppression des conteneurs avec `docker compose down`.
4. Recréation des conteneurs avec `docker compose up -d`.
5. Vérification de la présence du livre avec `GET /books`.

**Résultat :** les données ont été conservées grâce au volume Docker.

## Commandes Docker utiles

```bash
# Démarrer les conteneurs
docker compose up -d

# Reconstruire l'image et démarrer
docker compose up -d --build

# Vérifier les conteneurs
docker compose ps

# Afficher les logs
docker compose logs api

# Arrêter les conteneurs
docker compose stop

# Redémarrer les conteneurs
docker compose start

# Supprimer les conteneurs et le réseau
docker compose down

# Lister les volumes
docker volume ls

# Lister les réseaux
docker network ls

# Lister les images du projet
docker images atelier-livres-api
docker images mongo
```

**Attention :** la commande `docker compose down -v` supprime également le volume et les données MongoDB.

## GitHub

Le projet est disponible sur GitHub :

https://github.com/KCastanho/Docker-livres

Le développement a été versionné progressivement avec plusieurs commits :

- Initialisation du projet
- Configuration Docker Compose et Node.js
- Ajout du modèle Book
- Configuration de l'accès MongoDB depuis Compass
- Implémentation des routes CRUD
- Configuration du serveur Express et de la connexion MongoDB