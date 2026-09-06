import test from "node:test";
import assert from "node:assert/strict";
import { calcularDebilidades, caminosEvolucion, extraerEstadisticas, obtenerPokemonCompleto, ErrorPokeApi } from "../src/services/pokemon";
import type { RelacionesTipo, Eslabon } from "../src/services/pokemon";

const recurso = (name: string) => ({ name, url: "https://pokeapi.co/api/v2/type/" + name + "/" });
const relacion = (doble: string[], mitad: string[] = [], inmune: string[] = []): RelacionesTipo => ({
  double_damage_from: doble.map(recurso),
  half_damage_from: mitad.map(recurso),
  no_damage_from: inmune.map(recurso),
});

test("combina ambos tipos: x4, resistencias compensadas e inmunidades", () => {
  assert.deepEqual(calcularDebilidades([
    relacion(["rock", "ice", "electric", "fire"]),
    relacion(["rock"], ["ice"], ["electric"]),
  ]), [{ tipo: "fire", multiplicador: 2 }, { tipo: "rock", multiplicador: 4 }]);
  assert.deepEqual(calcularDebilidades([
    relacion([], [], ["electric"]), relacion(["electric"]),
  ]), []);
});

test("conserva cada rama desde su raíz y admite especies sin evolución", () => {
  const hoja = (name: string): Eslabon => ({ species: recurso(name), evolves_to: [] });
  const arbol: Eslabon = { species: recurso("inicio"), evolves_to: [
    { species: recurso("medio"), evolves_to: [hoja("final")] }, hoja("alternativa"),
  ] };
  assert.deepEqual(caminosEvolucion(arbol).map((camino) => camino.map((e) => e.name)),
    [["inicio", "medio", "final"], ["inicio", "alternativa"]]);
  assert.deepEqual(caminosEvolucion(hoja("unico")).map((camino) => camino.map((e) => e.name)), [["unico"]]);
});

test("mapea estadísticas por nombre aunque la respuesta venga desordenada", () => {
  const stats = [
    ["speed", 90], ["special-defense", 80], ["attack", 60],
    ["hp", 50], ["special-attack", 70], ["defense", 40],
  ].map(([name, valor]) => ({ stat: recurso(String(name)), base_stat: Number(valor) }));
  assert.deepEqual(extraerEstadisticas(stats),
    { hp: 50, ataque: 60, defensa: 40, ataqueEspecial: 70, defensaEspecial: 80, velocidad: 90 });
});

test("no inventa ceros si la API omite estadísticas o devuelve valores inválidos", () => {
  assert.throws(() => extraerEstadisticas([]), /ausente o inválida/);
  assert.throws(() => extraerEstadisticas([{ stat: recurso("hp"), base_stat: -1 }]), /inválida/);
});

test("deduplica consultas concurrentes y permite reintentar después de un fallo", async (context) => {
  let llamadas = 0;
  context.mock.method(globalThis, "fetch", async () => {
    llamadas++;
    await new Promise((resolve) => setTimeout(resolve, 5));
    return new Response("{}", { status: llamadas === 1 ? 503 : 404 });
  });
  const resultados = await Promise.allSettled([
    obtenerPokemonCompleto("prueba-reintento"), obtenerPokemonCompleto("prueba-reintento"),
  ]);
  assert.ok(resultados.every((resultado) => resultado.status === "rejected"));
  assert.equal(llamadas, 1);
  assert.equal(await obtenerPokemonCompleto("prueba-reintento"), null);
  assert.equal(llamadas, 2);
});

test("un recurso secundario ausente no se confunde con un Pokémon inexistente", async (context) => {
  context.mock.method(globalThis, "fetch", async (url: string) => {
    if (url.includes("/pokemon/")) return Response.json({
      id: 1, name: "prueba-especie", types: [],
      species: { name: "prueba-especie", url: "https://pokeapi.co/api/v2/pokemon-species/prueba-especie/" },
    });
    return new Response("{}", { status: 404 });
  });
  await assert.rejects(obtenerPokemonCompleto("prueba-especie"),
    (error: unknown) => error instanceof ErrorPokeApi && error.status === 404);
});
