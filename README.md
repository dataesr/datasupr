# DATASUPR

## Development

DatasupR is fully functional in development.

node: 24

Please build the app before starting it:
`npm ci --silent && npm run build --mode=staging`

To install it : `npm i`
To run it locally : `npm start`

And the project should be available via your favorite browser at http://localhost:5173/.

## Build for production

The react client app is served by the node server in production.
Vite build creates a build in `/dist` folder. This folder has to be moved into the `/server` folder.


## Deployment

The version number follows [semver](https://semver.org/).

To deploy in production, simply run this command from your staging branch :

`npm run deploy:[patch|minor|major]`
⚠️ Obviously, only members of the dataesr organization have rights to push on the repo.