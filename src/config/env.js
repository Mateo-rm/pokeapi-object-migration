import dotenv from 'dotenv';
dotenv.config();

export const config = {
  pokeApiUrl: process.env.POKEAPI_BASE_URL,
  hubspotApiKey: process.env.HUBSPOT_API_KEY,
};