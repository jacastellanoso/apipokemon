import EtiquetaTipo from "./EtiquetaTipo";
import { ESTADISTICAS } from "./datosOpcionales";
import type { DatosOpcionales } from "./datosOpcionales";
import { formatearNombre } from "./servicioPokemon";
import CadenaEvolucion from "./CadenaEvolucion";
import Icono from "../ui/Icono";

export default function DetallesPokemon({ pokemon }: { pokemon: DatosOpcionales }) {
  const disponibles = ESTADISTICAS.filter(([clave]) => pokemon.estadisticas?.[clave] !== undefined);
  // Escala visual compartida de 0 a 300; se amplía si llegan valores superiores.
  const escala = Math.max(300, ...disponibles.map(([clave]) => pokemon.estadisticas![clave]!));
  const totalBloques = 20;
  return (
    <>
      {!!pokemon.debilidades?.length && (
        <div className="pokemon-detalle">
          <h3>Debilidades</h3>
          <ul className="pokemon-tarjeta__tipos">
            {pokemon.debilidades.map(({ tipo, multiplicador }) => (
              <li key={tipo}>
                <EtiquetaTipo tipo={tipo}>
                  <strong aria-label={"Multiplicador " + multiplicador}> ×{multiplicador}</strong>
                </EtiquetaTipo>
              </li>
            ))}
          </ul>
        </div>
      )}
      {!!pokemon.evoluciones?.length && <CadenaEvolucion evoluciones={pokemon.evoluciones} />}
      {disponibles.length > 0 && (
        <div className="pokemon-detalle">
          <h3><Icono nombre="estadisticas" /> Estadísticas base</h3>
          <p className="pokemon-estadisticas__escala">Escala 0–{escala}</p>
          <dl className="pokemon-estadisticas">
            {disponibles.map(([clave, etiqueta], fila) => {
              const valor = pokemon.estadisticas![clave]!;
              return (
                <div className="pokemon-estadistica" key={clave} style={{ "--fila": fila } as React.CSSProperties}>
                  <dt>{etiqueta}</dt>
                  <dd>
                    <span className="pokemon-estadistica__barra" aria-hidden="true">
                      {Array.from({ length: totalBloques }, (_, indice) => <i key={indice} className={indice < Math.round(valor / escala * totalBloques) ? "is-filled" : ""} style={{ "--bloque": indice } as React.CSSProperties} />)}
                    </span>
                    <span className="pokemon-estadistica__valor">{valor}</span>
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      )}
    </>
  );
}
