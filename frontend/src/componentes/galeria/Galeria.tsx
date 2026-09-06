import ModalPokemon from "./ModalPokemon";
import { useCallback, useEffect, useState } from "react";
import TarjetaPokemon from "./TarjetaPokemon";
import { obtenerPokemon } from "./servicioPokemon";
import type { Pokemon } from "./servicioPokemon";
import "./galeria.css";

type Estado =
  | { tipo: "cargando" }
  | { tipo: "error" }
  | { tipo: "exito"; pokemon: Pokemon[] };

export default function Galeria() {
  const [estado, setEstado] = useState<Estado>({ tipo: "cargando" });
  const [intento, setIntento] = useState(0);
  const [seleccionado, setSeleccionado] = useState<Pokemon | null>(null);
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

  return (
    <section className="galeria" aria-labelledby="galeria-titulo">
      <div className="galeria__contenido">
        <div className="galeria__cabecera">
          <span className="galeria__acento" aria-hidden="true" />
          <h2 id="galeria-titulo">Galería Pokémon</h2>
        </div>
        <div aria-live="polite" aria-atomic="true">
          {estado.tipo === "cargando" && (
            <p className="galeria__estado" role="status">
              <span className="galeria__indicador" aria-hidden="true" />
              Cargando Pokémon…
            </p>
          )}
          {estado.tipo === "error" && (
            <div className="galeria__estado">
              <p>No pudimos cargar los Pokémon. Inténtalo de nuevo.</p>
              <button className="galeria__reintentar" onClick={() => setIntento((valor) => valor + 1)}>
                Reintentar
              </button>
            </div>
          )}
          {estado.tipo === "exito" && estado.pokemon.length === 0 && (
            <p className="galeria__estado">No se encontraron Pokémon</p>
          )}
        </div>
        {estado.tipo === "exito" && estado.pokemon.length > 0 && (
          <ul className="galeria__cuadricula">
            {estado.pokemon.map((pokemon) => <TarjetaPokemon key={pokemon.id} pokemon={pokemon} onSeleccionar={setSeleccionado} />)}
          </ul>
        )}
      </div>
      {seleccionado && <ModalPokemon key={seleccionado.id} pokemon={seleccionado} onCerrar={cerrarModal} />}
    </section>
  );
}
