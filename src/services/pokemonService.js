import axios from "axios";
import { enviromentVariables } from "../config/env.js";
import logger from "../utils/logger.js";
import { pokemonSchema, validateData } from "../utils/validation.js";
import { migrateToHubspot } from "./hubspotService.js";

const { POKEAPI_BASE_URL } = enviromentVariables

export async function migratePokemons() {
  try {
    const response = await axios.get(`${POKEAPI_BASE_URL}/pokemon?limit=100`);
    const pokemons = response.data.results;

    logger.info(`Fetched ${pokemons.length} Pokemon from API`);

    // Transform the data into the correct format
    const formattedPokemons = await Promise.all(
      pokemons.map(async (pokemon) => {
        const details = await axios.get(pokemon.url);

        const pokemonData = {
          id: details.data.id,
          name: details.data.name,
          hp: details.data.stats.find((s) => s.stat.name === "hp").base_stat,
          attack: details.data.stats.find((s) => s.stat.name === "attack").base_stat,
          defense: details.data.stats.find((s) => s.stat.name === "defense").base_stat,
          specialAttack: details.data.stats.find((s) => s.stat.name === "special-attack").base_stat,
          specialDefense: details.data.stats.find((s) => s.stat.name === "special-defense").base_stat,
          speed: details.data.stats.find((s) => s.stat.name === "speed").base_stat,
          types: details.data.types.map((t) => t.type.name),
          moves: details.data.moves.map((m) => m.move.url.split("/").slice(-2, -1)[0]),
          locations: [], // Esto se llenará luego con las asociaciones
        };

        // 🟢 Validating the Pokémon with Zod
        const validPokemon = validateData(pokemonSchema, pokemonData);
        if (!validPokemon) {
          logger.error(`Invalid Pokemon data: ${pokemonData.name}`);
          return null; // Ignora los datos inválidos
        }

        return validPokemon;
      })
    );

    // Filter out invalid Pokémon (null)
    const validPokemons = formattedPokemons.filter((p) => p !== null);
    logger.info(`Validated ${validPokemons.length} Pokemon successfully`);

    
    // 🔽 HubSpot Migration 🔽
    await migrateToHubspot("pokemon", validPokemons);

  } catch (error) {
    logger.error("Error fetching Pokemon:", error);
  }
}
