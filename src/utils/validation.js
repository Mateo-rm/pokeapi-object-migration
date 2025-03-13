import { z } from "zod";

// 🟢 Validation scheme for a Pokémon
export const pokemonSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  hp: z.number().int().nonnegative(),
  attack: z.number().int().nonnegative(),
  defense: z.number().int().nonnegative(),
  specialAttack: z.number().int().nonnegative(),
  specialDefense: z.number().int().nonnegative(),
  speed: z.number().int().nonnegative(),
  types: z.array(z.string().min(1)), // A Pokémon has at least 1 type
  moves: z.array(z.any()), // Array of transaction IDs
  locations: z.array(z.number()), // Array of location IDs
});

// 🟢 Validation scheme for a Movement
export const moveSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  pp: z.number().int().positive(),
  power: z.number().int().nonnegative(),
});

// 🟢 Validation scheme for a Location
export const locationSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  numberOfAreas: z.number().int().nonnegative(),
  region: z.string().optional(), // Can be null or a string
  generation: z.string().optional(),
});

// 🟢 Function to validate data with Zod
export function validateData(schema, data) {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error("Validation Error:", result.error.format());
    return null;
  }
  return result.data; // Returns validated data if correct
}
