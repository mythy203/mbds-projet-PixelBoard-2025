# 2025 MBDS project PixelBoard

## Introduction
this is a mono-repo project for the 2025 MBDS project PixelBoard. It contains the following packages:
- `client`: the frontend of the project
- `api`: the backend of the project
- `websocket`: the websocket server of the project

You can use this skeleton to start your project.    
You have to edit the root package.json file : 
- replace the name property (replace xxxx by the first letter of each member of your group)
- set the repository by setting the url of your project  


## Installation
To install the project, you need to clone the repository and install the dependencies. You can do this by running the following commands in the root directory of the project:
``` js
yarn
```
## Docker & MongoDB Setup
1. Start MongoDB using Docker Compose
- Stop and remove volumes if needed
``` js
docker-compose down -v 
```
-  Start services in detached mode
``` js
docker-compose up -d 
```
2. Access MongoDB via MongoDB Compass (optional)<br>
You can connect to the database using this URI:
``` js
mongodb://admin:password@localhost:27017/pixelboard?authSource=admin
```
## Usage
To start the project, you need to run the following commands in the root directory of the project (in three separate terminals):
``` js
yarn start:client 
```
*call start script in ./packages/client package.json (to start the react client)*  

``` js
yarn start:api 
```
*call start script in ./packages/api package.json (to start the api)*

``` js
yarn start:wss
```
*call start script in ./packages/websocket package.json (to start the websocket server)*

## Adding libraries

If you want to add library you can use the following commands (in the root directory of the project) :
``` js
yarn workspace <client|api> add <package-name> 
```
For example to add `express` to the api package you can run:
``` js
yarn workspace api add express
```

For example to add a librairy for devDependencies to the client package you can run:
``` js
yarn workspace client add -D <package-name>
```

###  Task Distribution (GROUPE 5)

| Nom           | Prénom         | GitHub              | Tâches effectuées                           |
|---------------|----------------|----------------------|----------------------------------------------|
| **BREZZO**    | Jérémie        | `jeremie-brezzo`     |   **Backend** :<br> API pixels et pixelboard, Setup authentification JWT<br>**Frontend** :<br>Page PixelBoard, affichage et intéraction de la pixelboard (zoom, drag, hover, recentrer)                                       |
| **SAMUEL**    | Jonathan       | `jtnsamuel`          |   **Backend** :<br> Modèle de données (users), déconnexion, contributions (pixelboard, nombre total de pixel ajoutés), modifier profil<br>**Frontend** :<br>Page administrateur, page utilisateur, Page home (affichage de la liste des pixelboards)                                          |
| **WANOUNOU**  | Ilan           | `IlanWanounou`       |  **Backend**: <br> Meilleure gestion des erreurs. Correction du temps d'attente avant de pouvoir placer un pixel. <br> **Frontend**: <br>  Gestion des pixels : récupération de tous les pixels déjà placés dans un pixelboard et affichage à la bonne position (avec leur couleur). Ajout d'une palette de couleurs, envoi au serveur lorsqu'un pixel est ajouté par un utilisateur. Gestion du temps d’attente. Vérification si un pixelboard accepte la réécriture d'un pixel. <br>  **WebSocket**: <br> Création d'un serveur WebSocket. Lorsqu'un client ajoute ou modifie un pixel sur un pixelboard, tous les autres clients présents sur le même pixelboard voient la modification sans besoin de rafraîchir leur écran.                                                           |
| **TRINH**     | Thi Thanh Thuy | `mythy203`           | **Backend** :<br>Configuration MongoDB avec Docker, Modèle de données Pixel et PixelBoard,Génération de l’aperçu (preview) avec canvas pour chaque PixelBoard,  Implantation de la route pour exporter l’image PNG (bonus)<br>**Frontend** :<br>Pages Login/Register, Pages Home, Header, amélioration PixelBoard (Ajout sidebar et bouton Export PNG), Dark/Light mode  |
| **BOCOUM**    | Allaye         | `allaye35`           | **Frontend** :<br>Pages de gestion du login (mot de passe et identifiant), formulaire d'inscription et de création de compte, page d'accueil (design, mise en page et redirection après connexion), configuration des routes<br>**Backend** :<br>Gestion des dépendances liées à l'authentification, configuration du formulaire de la page administrateur, configuration de l’ORM pour le mapping avec la base de données<br>**Divers** :<br>Gestion des routes et formulaire pour ajouter/modifier un pixel coloré |


