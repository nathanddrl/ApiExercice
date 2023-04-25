Nathan Dudreuil

# Monkey Breeding API

Cette API permet de gérer les singes, leurs caractéristiques et de les reproduire pour obtenir des singes avec de meilleures caractéristiques ainsi que de les faire combattre pour déterminer le meilleur singe.

## Installation

1. Clonez le dépôt :
git clone https://github.com/nathanddrl/monkey-api.git


2. Installez les dépendances :
cd monkey-api
npm install

3. Configurez les variables d'environnement dans un fichier `.env` à la racine du projet. Par exemple :
MONGO_USER=utilisateur
MONGO_PASSWORD=motdepasse
SECRET_KEY=clésecrète


4. Démarrez le serveur :
node app.js


## API Endpoints

### Singes

- `GET /monkeys` : Récupère tous les singes
- `GET /monkeys/:id` : Récupère un singe par son ID
- `POST /monkeys` : Crée un nouveau singe
- `PUT /monkeys/:id` : Met à jour un singe par son ID
- `DELETE /monkeys/:id` : Supprime un singe par son ID
- `POST /monkeys/breed` : Reproduit deux singes et crée un enfant
- `POST /monkeys/fight` : Fait combattre deux singes et retourne le gagnant

### Utilisateurs
- `GET /users` : Récupère tous les utilisateurs
- `GET /users/:id` : Récupère un utilisateur par son ID
- `POST /users` : Crée un nouvel utilisateur
- `PUT /users/:id` : Met à jour un utilisateur par son ID
- `DELETE /users/:id` : Supprime un utilisateur par son ID



### Authentification

- `POST /auth/register` : Crée un nouvel utilisateur
- `POST /auth/login` : Connecte un utilisateur existant


### Potentielles améliorations

- pagination 
- filtres
- tests unitaires
- Gestion des erreurs
