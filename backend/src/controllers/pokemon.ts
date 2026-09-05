// Importamos los tipos de TypeScript que describen una petición (Request) 
// y una respuesta (Response) dentro del framework Express
import type { Request, Response } from "express";

// Función asíncrona que atenderá la búsqueda del pokémon
export async function getPokemon(req: Request, res: Response) {
  // 1. OBTENER EL NOMBRE DESDE LA URL
  // Extraemos ':nombre' que viene en los parámetros de la ruta (req.params)
  const { nombre } = req.params;

  try {
    // 2. CONSULTAR A LA API EXTERNA
    // Nuestro servidor actúa como cliente y le pide los datos a PokéAPI
    const r = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`);

    // 3. VALIDAR LA RESPUESTA
    // Si la PokéAPI responde con error (por ejemplo, código 404 porque no existe),
    // evitamos que el servidor colapse y respondemos un 404 claro según el contrato
    if (!r.ok) {
      return res.status(404).json({ error: "No lo encontré" });
    }

    // Convertimos la respuesta cruda de la PokéAPI en un objeto JSON
    const data = await r.json();

    // 4. REFORMAR LOS DATOS (FILTRADO LIMPIO)
    // No reenviamos el JSON completo de PokéAPI (que tiene miles de líneas).
    // Construimos un objeto nuevo únicamente con las 4 propiedades requeridas:
    return res.json({
      id: data.id,                                                     // Número identificador
      nombre: data.name,                                               // Nombre oficial
      imagen: data.sprites.other["official-artwork"].front_default,   // Ilustración oficial
      tipos: data.types.map((t: any) => t.type.name),                 // Arreglo solo con los nombres de los tipos
    });

  } catch (error) {
    // 5. MANEJO DE CAÍDAS INESPERADAS
    // Si falla la conexión a internet o el fetch colapsa, devolvemos un 500 controlado
    return res.status(500).json({ error: "Error interno del servidor" });
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
