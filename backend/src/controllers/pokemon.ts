// Importamos los tipos de TypeScript que describen una petición (Request) 
// y una respuesta (Response) dentro del framework Express
import type { Request, Response } from "express";

import { obtenerPokemonCompleto } from "../services/pokemon";

// Mantiene el contrato básico y agrega los detalles consumidos por el modal.
export async function getPokemon(req: Request, res: Response) {
  const { nombre } = req.params;
  if (typeof nombre !== "string" || !nombre.trim()) {
    return res.status(400).json({ error: "Indica un nombre o número de Pokémon" });
  }
  try {
    const pokemon = await obtenerPokemonCompleto(nombre);
    if (!pokemon) return res.status(404).json({ error: "No lo encontré" });
    return res.json(pokemon);
  } catch {
    return res.status(502).json({ error: "No pudimos obtener los datos completos de Pokémon. Inténtalo de nuevo." });
  }
}

export async function getPokemonTipos(req: Request, res: Response) {
  const { nombre } = req.params;

  try {
    const r = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`);

    if (!r.ok) {
      return res.status(404).json({ error: "No lo encontré" });
    }

    const data = await r.json();
    return res.json(data.types.map((t: { type: { name: string } }) => t.type.name));
  } catch (error) {
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
