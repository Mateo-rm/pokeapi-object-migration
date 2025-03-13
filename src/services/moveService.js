import axios from "axios";
import { config } from "../config/env.js";
import logger from "../utils/logger.js";
import { moveSchema, validateData } from "../utils/validation.js";

export async function migrateMoves() {
  try {
    const response = await axios.get(`${config.pokeApiUrl}/move?limit=100`);
    const moves = response.data.results;

    logger.info(`Fetched ${moves.length} Moves from API`);

    const formattedMoves = await Promise.all(
      moves.map(async (move) => {
        const details = await axios.get(move.url);

        const moveData = {
          id: details.data.id,
          name: details.data.name,
          pp: details.data.pp,
          power: details.data.power || 0, // Some movements have no power, so we set 0
        };

        // 🟢 Validating the Pokémon with Zod
        const validMove = validateData(moveSchema, moveData);
        if (!validMove) {
          logger.error(`Invalid Move data: ${moveData.name}`);
          return null;
        }

        return validMove;
      })
    );

    const validMoves = formattedMoves.filter((m) => m !== null);
    logger.info(`Validated ${validMoves.length} Moves successfully`);

    /*let y = JSON.stringify(validMoves);
    console.log(`Moves: ${y}`);*/
    
    // 🔽 HubSpot Migration 🔽

  } catch (error) {
    logger.error("Error fetching Moves:", error);
  }
}
