# Projet Graphe de Recherche - Daryl

Ce projet affiche un graphe interactif de résultats de recherche à partir d'une requête utilisateur.  
Le frontend affiche un graphe avec vis-network, et le backend fournit les données via une API.

---

## Architecture

Voici un diagramme simple de l’architecture globale du projet :

```plaintext
+-----------------------+          HTTP                   +-------------------+
|                       |   <-------------------------->  |                   |
|    Frontend (HTML +   |                                |      Backend       |
|    Web Component JS)  |                                |  Node.js + Express |
|       (port 3000)     |                                |     (port 5000)    |
+-----------------------+                                +-------------------+
            |                                                       |
            |                                                       |
            |                        +----------------+             |
            |                        |     Redis      |             |
            +----------------------> |  (cache, etc.) | <-----------+
                                     |   (port 6379)  |
                                     +----------------+
```

---

## Installation

Cloner le repo, puis installer les dépendances (frontend & backend) :

```bash
npm install
```

Le projet est packagé avec Docker pour un démarrage simple.

Lancer la stack complète (backend + frontend + cache Redis) avec la commande :

```bash
docker-compose up -d
```

Le frontend sera accessible sur :  
http://localhost:3000

Le backend est accessible sur le port 5000 en interne dans le container.

---

## Utilisation

- Saisir une requête dans le champ de recherche (ex : solutions acoustiques de sonorisation)  
- Cliquer sur Rechercher  
- Le graphe se charge et s’affiche dans la zone dédiée (hauteur ~600px)  
- Cliquer sur un noeud avec URL ouvre la page correspondante dans un nouvel onglet  

---

## Gestion des erreurs

En cas d’erreur backend ou réponse vide, un message d’erreur s’affiche sous la barre de recherche.  
Le frontend gère proprement les cas sans données à afficher.

---

## Tests End-to-End (E2E)

Des tests Playwright valident :  
- Le chargement du graphe depuis le backend  
- L’affichage du canvas SVG dans le shadow DOM  
- La réponse API avec au moins un noeud  
- Le temps de chargement du graphe en moins de 3 secondes

Pour lancer les tests E2E (localement, hors Docker) :

```bash
npm run e2e
```

---

## Tests unitaires (Backend)

Les tests unitaires sont écrits avec Jest.

Pour lancer les tests :

```bash
cd backend
npm install
npm test
```

---

## Améliorations possibles

- Ajouter un spinner pendant le chargement  
- Gestion plus fine des erreurs serveur  
- Rendre le graphe responsive mobile  
- Ajouter des interactions utilisateur supplémentaires  
- Sanitiser la requête utilisateur côté frontend et/ou backend pour éviter :  
  - les tentatives d'injection (ex: script, caractères spéciaux, etc.)  
  - les appels inutiles à l'API avec des caractères non pertinents  

---

## Contact

Pour toute question, contact : korneel.loy@gmail.com

Projet réalisé avec Daryl - Juin 2025
