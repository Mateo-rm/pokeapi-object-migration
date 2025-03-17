import axios from "axios";
import logger from "../utils/logger.js";
import { locationSchema, validateData } from "../utils/validation.js";

// New configuration of environment variables
import { enviromentVariables } from '../config/env.js';
const { POKEAPI_BASE_URL } = enviromentVariables;

export async function migrateLocations() {
  try {
    const response = await axios.get(`${POKEAPI_BASE_URL}/location?limit=100`);
    const locations = response.data.results;

    logger.info(`Fetched ${locations.length} Locations from API`);

    const formattedLocations = await Promise.all(
      locations.map(async (location) => {
        const details = await axios.get(location.url);

        const locationData = {
          id: details.data.id,
          name: details.data.name,
          numberOfAreas: details.data.areas ? details.data.areas.length : 0, // Some locations may not have areas
          region: details.data.region?.name || "Unknown",
          generation: details.data.generation?.name || "Unknown",
        };

        // 🟢 Validating the Pokémon with Zod
        const validLocation = validateData(locationSchema, locationData);
        if (!validLocation) {
          logger.error(`Invalid Location data: ${locationData.name}`);
          return null;
        }

        return validLocation;
      })
    );

    const validLocations = formattedLocations.filter((l) => l !== null);
    logger.info(`Validated ${validLocations.length} Locations successfully`);
    
    /*let x = JSON.stringify(validLocations);
    console.log(`Locations: ${x}`);*/
    
    // 🔽 HubSpot Migration 🔽

  } catch (error) {
    logger.error("Error fetching Locations:", error);
  }
}
