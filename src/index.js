import logger from './utils/logger.js';
import { migratePokemons } from './services/pokemonService.js';
import { migrateMoves } from './services/moveService.js';
import { migrateLocations } from './services/locationService.js';

/*
import { enviromentVariables } from './config/env.js';
const { POKEAPI_BASE_URL, HUBSPOT_API_KEY } = enviromentVariables
*/


(async () => {
  try {
    logger.info('Starting migration...');

    await migratePokemons();
    await migrateMoves();
    await migrateLocations();

    logger.info('Migration completed successfully!');
  } catch (error) {
    logger.error('Migration failed:', error);
  }
})();
