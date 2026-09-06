import ModalPokemon from "./ModalPokemon";
import { useCallback, useEffect, useMemo, useState } from "react";
import TarjetaPokemon from "./TarjetaPokemon";
import { obtenerPokemon } from "./servicioPokemon";
import type { Pokemon } from "./servicioPokemon";
import BuscadorPokemon from "./BuscadorPokemon";
import FiltrosPokemon from "./FiltrosPokemon";
import Icono from "../ui/Icono";
import "./galeria.css";

type Estado =
  | { tipo: "cargando" }
  | { tipo: "error" }
  | { tipo: "exito"; pokemon: Pokemon[] };

export default function Galeria() {
  const [estado, setEstado] = useState<Estado>({ tipo: "cargando" });
  const [intento, setIntento] = useState(0);
  const [seleccionado, setSeleccionado] = useState<Pokemon | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("todos");
  const cerrarModal = useCallback(() => setSeleccionado(null), []);

  useEffect(() => {
    const controller = new AbortController();
    let activo = true;
    const timeout = window.setTimeout(() => controller.abort(), 20000);
    setEstado({ tipo: "cargando" });
    obtenerPokemon(controller.signal)
      .then((pokemon) => { if (activo) setEstado({ tipo: "exito", pokemon }); })
      .catch(() => {
        if (activo) setEstado({ tipo: "error" });
        controller.abort();
      })
      .finally(() => window.clearTimeout(timeout));
    return () => {
      activo = false;
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [intento]);

  const pokemon = estado.tipo === "exito" ? estado.pokemon : [];
  const tipos = useMemo(() => [...new Set(pokemon.flatMap((item) => item.tipos))].sort(), [pokemon]);
  const visibles = useMemo(() => {
    const consulta = busqueda.trim().toLocaleLowerCase("es");
    return pokemon.filter((item) => (filtro === "todos" || item.tipos.includes(filtro)) &&
      (!consulta || item.nombre.toLocaleLowerCase("es").includes(consulta) || String(item.id) === consulta));
  }, [pokemon, busqueda, filtro]);

  return (
    <section className="galeria" id="galeria" aria-labelledby="galeria-titulo">
      <div className="galeria__contenido">
        <div className="galeria__cabecera">
          <span className="galeria__acento" aria-hidden="true" />
          <h2 id="galeria-titulo">Galería Pokémon</h2>
        </div>
        <div aria-live="polite" aria-atomic="true">
          {estado.tipo === "cargando" && (
            <p className="galeria__estado" role="status">
              <span className="galeria__indicador" aria-hidden="true" />
              Sincronizando con la Pokédex…
            </p>
          )}
          {estado.tipo === "error" && (
            <div className="galeria__estado">
              <Icono nombre="alerta" className="galeria__estado-icono" />
              <p>No pudimos conectar con la Pokédex. Comprueba que el backend esté activo.</p>
              <button className="galeria__reintentar" onClick={() => setIntento((valor) => valor + 1)}>
                Reintentar
              </button>
            </div>
          )}
          {estado.tipo === "exito" && estado.pokemon.length === 0 && (
            <p className="galeria__estado">No se encontraron Pokémon</p>
          )}
        </div>
        {estado.tipo === "exito" && estado.pokemon.length > 0 && <>
          <div className="galeria__controles">
            <BuscadorPokemon valor={busqueda} onCambiar={setBusqueda} />
            <FiltrosPokemon tipos={tipos} activo={filtro} onCambiar={setFiltro} />
          </div>
          {visibles.length ? <ul className="galeria__cuadricula" key={filtro + busqueda}>
            {visibles.map((item, indice) => <TarjetaPokemon key={item.id} pokemon={item} onSeleccionar={setSeleccionado} orden={indice} />)}
          </ul> : <p className="galeria__estado">No hay registros que coincidan con tu búsqueda.</p>}
        </>}
      </div>
      {seleccionado && <ModalPokemon key={seleccionado.id} pokemon={seleccionado} onCerrar={cerrarModal} />}
    </section>
  );
}
