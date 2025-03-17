/* 
  Please update node to a version that supports environment variables (+v20)
  https://nodejs.org/en/learn/command-line/how-to-read-environment-variables-from-nodejs
  Now, you can use the --env-file flag to specify an environment file when running your Node.js application.

  Please check the package.json, where is set the new command "dev" and "start"
  with the following configuration (Check in the documentation)
  (Example) - node --env-file=.env --env-file=.development.env app.js

  USAGE.
  import { enviromentVariables } from './config/env.js';
  { POKEAPI_BASE_URL: enviromentVariables.POKEAPI_BASE_URL, HUBSPOT_API_KEY: enviromentVariables.HUBSPOT_API_KEY }
*/
const enviromentVariables = {
    POKEAPI_BASE_URL: process.env.POKEAPI_BASE_URL,
    HUBSPOT_API_KEY: process.env.HUBSPOT_API_KEY
};

export { enviromentVariables };