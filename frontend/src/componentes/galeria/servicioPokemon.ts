import { leerOpcionales } from "./datosOpcionales";
import type { DatosOpcionales } from "./datosOpcionales";

export interface Pokemon extends DatosOpcionales {
  id: number;
  nombre: string;
  imagen: string | null;
  tipos: string[];
}

// Vite redirige /api al backend local. Permite otra URL en despliegues.
const API_BASE = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/$/, "");
const IDENTIFICADORES = Array.from({ length: 40 }, (_, index) => index + 1);

export async function obtenerPokemon(signal: AbortSignal): Promise<Pokemon[]> {
  // El backend solo ofrece consultas individuales, no un listado.
  const resultados = await Promise.all(
    IDENTIFICADORES.map(async (id): Promise<Pokemon | null> => {
      const respuesta = await fetch(API_BASE + "/pokemon/" + id, { signal });
      if (respuesta.status === 404) return null;
      if (!respuesta.ok) throw new Error("Error HTTP " + respuesta.status);
      const dato = await respuesta.json();
      if (!dato || !Number.isInteger(dato.id) || dato.id < 1 ||
          typeof dato.nombre !== "string" || !dato.nombre.trim()) {
        throw new Error("Respuesta de Pokémon inválida");
      }
      return {
        ...leerOpcionales(dato),
        id: dato.id,
        nombre: dato.nombre,
        imagen: typeof dato.imagen === "string" && dato.imagen.trim() ? dato.imagen : null,
        tipos: Array.isArray(dato.tipos)
          ? dato.tipos.filter((tipo: unknown): tipo is string => typeof tipo === "string" && !!tipo.trim())
          : [],
      };
    }),
  );
  return [...new Map(resultados.filter((dato): dato is Pokemon => dato !== null)
    .map((dato) => [dato.id, dato])).values()];
}

export function formatearNombre(nombre: string): string {
  return nombre.replace(/-/g, " ").replace(/(^|\s)\S/g, (letra) => letra.toLocaleUpperCase("es"));
}
