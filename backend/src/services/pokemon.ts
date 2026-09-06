interface Recurso { name: string; url: string }
export interface PokemonApi {
  id: number;
  name: string;
  species: Recurso;
  sprites: { other: { "official-artwork": { front_default: string | null } } };
  types: { type: Recurso }[];
  stats: { base_stat: number; stat: Recurso }[];
}
interface Especie {
  id: number;
  name: string;
  evolution_chain: { url: string } | null;
  varieties: { is_default: boolean; pokemon: Recurso }[];
}
export interface RelacionesTipo {
  double_damage_from: Recurso[];
  half_damage_from: Recurso[];
  no_damage_from: Recurso[];
}
export interface Eslabon {
  species: Recurso;
  evolves_to: Eslabon[];
}
interface Etapa { id: number; nombre: string; imagen?: string }

const BASE = "https://pokeapi.co/api/v2/";
const cache = new Map<string, { vence: number; promesa: Promise<unknown> }>();

export class ErrorPokeApi extends Error {
  constructor(public status: number) { super("PokéAPI respondió " + status); }
}

async function consultar<T>(direccion: string): Promise<T> {
  const url = new URL(direccion, BASE);
  if (url.origin !== "https://pokeapi.co" || !url.pathname.startsWith("/api/v2/")) {
    throw new Error("Recurso de PokéAPI inválido");
  }
  const clave = url.href;
  const existente = cache.get(clave);
  if (existente && existente.vence > Date.now()) return existente.promesa as Promise<T>;
  const promesa = (async () => {
    const respuesta = await fetch(clave, { signal: AbortSignal.timeout(5000) });
    if (!respuesta.ok) throw new ErrorPokeApi(respuesta.status);
    return respuesta.json() as Promise<T>;
  })();
  if (cache.size >= 256) cache.delete(cache.keys().next().value!);
  cache.set(clave, { vence: Date.now() + 5 * 60 * 1000, promesa });
  try {
    return await promesa;
  } catch (error) {
    // Los fallos nunca quedan cacheados; el usuario puede reintentar.
    if (cache.get(clave)?.promesa === promesa) cache.delete(clave);
    throw error;
  }
}

export function calcularDebilidades(relaciones: RelacionesTipo[]) {
  const factores = new Map<string, number>();
  for (const relacion of relaciones) {
    for (const [recursos, factor] of [
      [relacion.double_damage_from, 2],
      [relacion.half_damage_from, 0.5],
      [relacion.no_damage_from, 0],
    ] as const) {
      for (const tipo of recursos) factores.set(tipo.name, (factores.get(tipo.name) ?? 1) * factor);
    }
  }
  return [...factores].filter(([, multiplicador]) => multiplicador > 1)
    .map(([tipo, multiplicador]) => ({ tipo, multiplicador }))
    .sort((a, b) => a.tipo.localeCompare(b.tipo));
}

export function caminosEvolucion(eslabon: Eslabon): Recurso[][] {
  if (!eslabon.evolves_to.length) return [[eslabon.species]];
  return eslabon.evolves_to.flatMap((hijo) =>
    caminosEvolucion(hijo).map((camino) => [eslabon.species, ...camino]));
}

export function extraerEstadisticas(stats: PokemonApi["stats"]) {
  const mapa = new Map(stats.map((stat) => [stat.stat.name, stat.base_stat]));
  const valor = (nombre: string) => {
    const base = mapa.get(nombre);
    if (base === undefined || !Number.isSafeInteger(base) || base < 0) {
      throw new Error("Estadística base ausente o inválida: " + nombre);
    }
    return base;
  };
  return {
    hp: valor("hp"),
    ataque: valor("attack"),
    defensa: valor("defense"),
    ataqueEspecial: valor("special-attack"),
    defensaEspecial: valor("special-defense"),
    velocidad: valor("speed"),
  };
}

export async function obtenerPokemonCompleto(nombre: string) {
  let data: PokemonApi;
  try {
    data = await consultar<PokemonApi>("pokemon/" + encodeURIComponent(nombre.trim().toLowerCase()) + "/");
  } catch (error) {
    // Solo un 404 del Pokémon solicitado significa que no existe.
    if (error instanceof ErrorPokeApi && error.status === 404) return null;
    throw error;
  }
  const [tipos, especie] = await Promise.all([
    Promise.all(data.types.map(({ type }) => consultar<{ damage_relations: RelacionesTipo }>(type.url))),
    consultar<Especie>(data.species.url),
  ]);
  const cadena = especie.evolution_chain
    ? (await consultar<{ chain: Eslabon }>(especie.evolution_chain.url)).chain
    : { species: data.species, evolves_to: [] };

  const caminos = caminosEvolucion(cadena);
  const recursos = [...new Map(caminos.flat().map((recurso) => [recurso.url, recurso])).values()];
  const etapas = new Map<string, Etapa>();
  await Promise.all(recursos.map(async (recurso) => {
    const especieEtapa = recurso.url === data.species.url ? especie : await consultar<Especie>(recurso.url);
    // Las especies con formas distintas se resuelven mediante su variedad oficial predeterminada.
    const variedad = especieEtapa.varieties.find((item) => item.is_default);
    if (!variedad) throw new Error("Especie sin variedad predeterminada");
    const pokemon = variedad.pokemon.name === data.name ? data : await consultar<PokemonApi>(variedad.pokemon.url);
    const imagen = pokemon.sprites.other["official-artwork"].front_default;
    etapas.set(recurso.url, {
      id: especieEtapa.id,
      nombre: especieEtapa.name,
      ...(imagen ? { imagen } : {}),
    });
  }));

  return {
    id: data.id,
    nombre: data.name,
    imagen: data.sprites.other["official-artwork"].front_default,
    tipos: data.types.map(({ type }) => type.name),
    debilidades: calcularDebilidades(tipos.map((tipo) => tipo.damage_relations)),
    evoluciones: caminos.map((camino) => camino.map((recurso) => etapas.get(recurso.url)!)),
    estadisticas: extraerEstadisticas(data.stats),
  };
}
