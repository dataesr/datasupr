# DOADIFY

## Development

Doadify is fully functional in development.

Simply run : `npm start`

And the project should be available via your favorite browser at http://localhost:5173/.


## Build for production

The react client app is served by the node server in production.
Vite build creates a build in `/dist` folder. This folder has to be moved to the `/server` folder.

## Utiliser le dsfr-plus en dev

- récupérer repo musical-octo-waddle + npm i
- npm link
  
Aller dans datasupr/client puis ```npm link dsfr-plus -w client```