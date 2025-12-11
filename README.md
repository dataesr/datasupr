# DATASUPR

## Development

DatasupR is fully functional in development.

node: 20.17.0

Please build the app before starting it:
`npm ci --silent && npm run build --mode=staging`

To install it : `npm i`
To run it locally : `npm start`

And the project should be available via your favorite browser at http://localhost:5173/.

## Build for production

The react client app is served by the node server in production.
Vite build creates a build in `/dist` folder. This folder has to be moved into the `/server` folder.
