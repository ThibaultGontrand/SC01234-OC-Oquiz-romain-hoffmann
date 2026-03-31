# CORR SC02E01

Début de challenge, on a des images
- oquiz-api
- postgres
- adminer

on a besoin d'une image pour notre client => on commence par le build de l'image juste pour voir si on peut créer un conteneur à partir de ça.
- Dockerfile dans client

## le Dockerfile

Problème, on va avoir besoin de deux choses :
	- le build du client : npm run build + variables d'environnement
	- avoir un serveur web statique pour pointer sur index.js du /dist => Nginx
Je commence par quoi ?? solution "multi-stage build" => image par plusieures étapes.
Logique : node22 pour build le client puis bascule Nginx pour servir le build

let's go:

## ETAPE 1 ===============================

````
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
# (penser au .dockerignore pour ne pas copier certains fichiers)
COPY ./ ./ 
RUN npm run build
````

Attention : lors de la commande `COPY ./ ./` on ne veut pas tout copier, on va créer un fichier .dockerignore
### .dockerignore
````
node_modules/        // on les aura avec la commande npm install
.env                 // on ne les utilisera pas à partir de ce fichier
dist/                // il sera généré avec la commande du build
.......              // autres cas de figure
````
Tout ce qui est dans le .dockerignore ne sera pas prit en compte lors de la création de l'image

Problème : dans le code source du client : on utilise une variable d'environement : VITE_API_BASE_URL (api.ts)
et au moment du build (npm run build) => lecture de la variable d'environement => pour le basculer dans le code "dist"
Solution : On va ajouter un argument qui sera utilisé lors du build !!! (docker build --build-arg VARIABLE=VALEUR)
déclaration de cet argument :
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL = ${VITE_API_BASE_URL}

RESULTAT FINAL

FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./ ./ 
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

Ici, un premier test possible pourrait être d'utiliser la preview

CMD ["npm", "run", "preview"]
Lance un serveur Vite

Mais on passse à l'étape 2
Avant toute chose on va devoir donner un nom à cette première étape pour se servir de son résultat dans la seconde :

FROM node:22-alpine AS builder

=======ETAPE 2=============

TESTER NGINX : docker run --name test-nginx -p 8081:80 -d nginx:alpine
navigateur : localhost:8081


FROM nginx:alpine

# Supprimer ce qui se trouve dans le dossier que sert Nginx (/user/share/nginx/html)
RUN rm -rf /usr/share/nginx/html/*

# Remplacer par ce qui se trouve dans notre dossier `/dist` de l'étape précédente
# --from permet de copier le dossier dist de l'étape précédente que l'on a nommé "builder"
COPY --from=builder /app/dist /usr/share/nginx/html

# Documentation : Nginx expose sur le port 80 dans le conteneur
EXPOSE 80

# Commande qui se lance au démarrage du conteneur // on retrouve ça dans la doc ou google ou chatgpt ....
# -g    				directive de configuration globale
# daemon off           	rester au premier plan (foreground) + ne se détache pas du terminal
CMD ["nginx", "-g", "daemon off;"]


======== TEST BUILD ============

Déjà en ligne de commande :
docker build -t oquiz-client --build-arg VITE_API_BASE_URL=http://localhost:3001/api client/

========= TEST RUN =============

si ok : on lance le conteneur
docker run -d -p 8000:80 --name oquiz-client oquiz-client

========== TEST NAVIGATEUR ================

//TESTER = navigateur => localhost:8000

========== TEST DANS LE CONTENEUR ===============

docker exec -it oquiz-client sh
// ls => cd usr/share/nginx/html

OK GOOD COMMIT TOUT CA

========== docker compose ===============
//on coupe tous les conteneurs
docker compose -p oquiz down
docker rm -f oquiz-client

//on rempli notre docker compose

  client:
    build:
      context: ./client
      dockerfile: Dockerfile
      args:  # équivalent du --build-arg
        - VITE_API_BASE_URL=http://localhost:3001/api
    restart: unless-stopped
    ports:
      - 8000:80
    depends_on:
      - api
    networks:
      - oquiz-network
	  
//on relance le tout
docker compose -p oquiz up -d

// on verif les conteneurs
docker ps -a

//tout couper
docker compose -p oquiz down

=========== BRAVO ===================

Problème : toutes les variables d'environement !!!!
solution : on va créer des fichiers d'env pour les différents env.

//création .env.docker
//remplissage

# DATABASE
POSTGRES_USER=oquiz
POSTGRES_PASSWORD=oquiz
POSTGRES_DB=oquiz
POSTGRES_LOCAL_PORT=5454
# API
DATABASE_URL=postgres://oquiz:oquiz@database:5432/oquiz
API_LOCAL_PORT=3001
# ADMINER
ADMINER_LOCAL_PORT=8080
# CLIENT
VITE_API_BASE_URL=http://localhost:3001/api
CLIENT_LOCAL_PORT=8000

//et remplacement dans le docker-compose.yml

services:                    # Liste des serveurs (nos conteneurs !)
  database:                  # Nom de notre premier service (nom du conteneur dans le réseau !) 
    image: postgres:17       # Image permettant de créer le conteneur
    restart: unless-stopped  # Redémarre automatiquement mon service en cas de crash (sauf si je l'ai éteint manuellement)
    networks:
      - oquiz-network
    volumes:
      - oquiz-volume:/var/lib/postgresql/data  # je monte mon volume oquiz-data dans mon conteneur, là où Postgres écrit par défaut ses données lorsqu'il manipule les tables
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    ports:                   # Si on a besoin de pouvoir contacter la BDD depuis l'extérieur, on peut rajouter ce binding de port, sinon pas besoin
      - ${POSTGRES_LOCAL_PORT}:5432

  api:
    build:                    # Plutôt que de partir d'une image existante, on demande à compose de générer l'image à partir de :
      context: ./api          # ce dossier
      dockerfile: Dockerfile  # ce Dockerfile
    # image:                  # Pour partir d'une image existante, on pourrait plutôt utiliser cette syntaxe
    #   oquiz-api             # Nom de l'image de laquelle on part
    restart: unless-stopped   # Redémarre automatiquement mon service en cas de crash (sauf si je l'ai éteint manuellement)
    environment:
      PORT: 3000
      DATABASE_URL: ${DATABASE_URL}  # On lit directement dans le conteneur (database) puisqu'on est sur le meme network = le port 5432 j'ai accès depuis cet autre conteneur
    ports:
      - ${API_LOCAL_PORT}:3000
    networks:
      - oquiz-network
    depends_on:
      - database # On s'assure que le service "database" soit lancé avant de lancer ce service

  client:
    build:
      context: ./client
      dockerfile: Dockerfile
      args:  # équivalent du --build-arg
        - VITE_API_BASE_URL=${VITE_API_BASE_URL}
    restart: unless-stopped
    ports:
      - ${CLIENT_LOCAL_PORT}:80
    depends_on:
      - api
    networks:
      - oquiz-network

  # Service complémentaire : pour visualiser et manipuler la BDD via une interface graphique
  adminer:
    image: adminer
    restart: unless-stopped
    ports: 
      - ${ADMINER_LOCAL_PORT}:8080
    depends_on:
      - database
    networks:
      - oquiz-network

networks:        # Liste des réseaux
  oquiz-network: # Nom du réseau

volumes:         # Liste de nos volumes
  oquiz-volume:  # Volume pour la persistance des données de la BDD (sur l'hôte, au cas où le conteneur est supprimé, les données restent !)


========== TEST ULTIME ====================

on dégage tout
conteneurs et images
docker rmi oquiz-api oquiz-client

//onrebuild tout : on oubli pas d'ajouter à la commande le fichier .env.docker
docker compose -p oquiz --env-file .env.docker up -d

//test api : localhost:3001/api/users
//test client : localhost:8000

============= CORRECTION FINIE =========================