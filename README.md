# Frontend-Babillard

## Outils de développement

Le projet nécessite :
- NodeJS 26
- Angular CLI v21
- Un navigateur Web (Safari, Firefox, navigateur Chromium)

Le projet se fait mieux avec :
- Visual Studio Code
- Visual Studio 2026 (pour déboguer l'API du serveur)

Pour tester le serveur de production, il faut installer Docker. Si vous utilisez Windows, assurez-vous d'installer préalablement WSL 2

## Serveur de développement

Pour démarrer un serveur de développement local, exécuter la commande

```bash
ng s --port 8080 --ssl
```

ou
```bash
npm run start
```

Une fois que le serveur est actif, ouvrez votre navigateur Web et allez à l'adresse `https://localhost:8080`. Le site se rechargera automatiquement à chaque modification effectuée.

## Serveur de production

Pour démarer un serveur local en contexte de production, exécuter la commande

```bash
docker compose --env-file ./.env up
```

Le serveur sera disponible à l'adresse `http://localhost:8080`. Plus de détails seront donnés ultérieurement concernant la configuration de production.

## Structure du projet

Les principaux répertoires sont 
```bash
|_public
|      |_____assets
|      |_____i18n
|             
|_src
    |_app
    |   |_components
    |   |_guards
    |   |_routed-components
    |   |_services
    |_environments
    |_models
    |_services

```

Répertoires et leur utilité:
- `src/app/components`: Pour tous les composants réutilisables qui n'ont pas pour but d'être directement routés
- `src/app/guards`: Pour la gestion d'accès. Certaines fonctionnalités sont limitées à certains types d'utilisateur
- `src/app/routed-components`: Pour tous les composants qui ont pour but d'être routés directement.
- `src/app/services`: Pour tous les services devant communiquer avec les API du serveur ou du gestionnaire d'identité

Afin de générer des components/guards/services à l'aide du CLI Angular, s'assurer d'être à la racine du dépôt, puis entrer la commande
```bash
ng generate <type> <sous-répertoire>/<nom> [...paramètres]
```

## Exécuter les tests unitaires

Exécuter les tests unitaires se fait à l'aide de la commande `npm run test` ou `ng test`. Les tests seront réexécutés automatiquement en cas de modification.

## Variables d'environnement

Le fichier `.env` est toujours ignoré. Il vous faut donc le recréer à partir de `.env.exemple`. Voici donc les différentes variables d'environnement et leur utilité:
- `NODE_ENV`: Le chemin de NodeJS sur la machine du serveur. Facultatif
- `NG_APP_REDIRECT_URL`: Le chemin de redirection une fois que l'authentification a été faite auprès du fournisseur d'identité. Essenstiel afin de faire fonctionner l'authentification
- `NG_APP_OPENID_CLIENT_ID`: L'identifiant de client OpenID du projet. Essentiel afin de faire fonctionner l'authentification.
- `NG_APP_OPENID_BASE_URL`: L'adresse servant à communiquer avec les points d'entrée API du fournisseur d'identité. Essentiel afin de faire fonctionner l'authentification
- `NG_APP_OPENID_ISSUER`: L'adresse du fournisseur d'identité. Essentiel afin de faire fonctionner l'authentification
- `NG_APP_OPENID_WELLKOWN`: L'adresse permettant d'accéder au fichier `.well-known` de la configuration OpenID. Essentiel afin de faire fonctionner l'authentification.
- `NG_APP_API_URL_DEV`: L'adresse du serveur de développement de l'API. Essentiel afin d'interagir avec le site en développement
- `NG_APP_API_URL_PROD`: L'adresse du serveur de production de l'API. Essentiel afin d'interagir avec le site en production
- `NG_APP_POST_LOGOUT_REDIRECT_URL`: L'adresse de retour après une déconnexion auprès du fournisseur d'identité. Essentiel afin de faire fonctionner l'authentification.
