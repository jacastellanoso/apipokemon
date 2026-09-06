import EtiquetaTipo from "./EtiquetaTipo";
import { ESTADISTICAS } from "./datosOpcionales";
import type { DatosOpcionales } from "./datosOpcionales";
import { formatearNombre } from "./servicioPokemon";

export default function DetallesPokemon({ pokemon }: { pokemon: DatosOpcionales }) {
  const disponibles = ESTADISTICAS.filter(([clave]) => pokemon.estadisticas?.[clave] !== undefined);
  // Escala visual compartida de 0 a 300; se amplía si llegan valores superiores.
  const escala = Math.max(300, ...disponibles.map(([clave]) => pokemon.estadisticas![clave]!));
  return (
    <>
      {!!pokemon.debilidades?.length && (
        <div className="pokemon-detalle">
          <h4>Debilidades</h4>
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
      {!!pokemon.evoluciones?.length && (
        <div className="pokemon-detalle">
          <h4>Cadena de evolución</h4>
          <div className="pokemon-evoluciones">
            {pokemon.evoluciones.map((camino) => (
              <ol className="pokemon-evolucion" key={camino.map((etapa) => etapa.id).join("-")} aria-label="Camino de evolución, de primera a última etapa">
                {camino.map((etapa) => (
                  <li key={etapa.id}>
                    <span className="pokemon-evolucion__etapa">
                      <small>#{String(etapa.id).padStart(3, "0")}</small>
                      {formatearNombre(etapa.nombre)}
                    </span>
                  </li>
                ))}
              </ol>
            ))}
          </div>
        </div>
      )}
      {disponibles.length > 0 && (
        <div className="pokemon-detalle">
          <h4>Estadísticas base</h4>
          <p className="pokemon-estadisticas__escala">Escala 0–{escala}</p>
          <dl className="pokemon-estadisticas">
            {disponibles.map(([clave, etiqueta]) => {
              const valor = pokemon.estadisticas![clave]!;
              return (
                <div className="pokemon-estadistica" key={clave}>
                  <dt>{etiqueta}</dt>
                  <dd>
                    <span className="pokemon-estadistica__barra" aria-hidden="true">
                      <span style={{ width: (valor / escala * 100) + "%" }} />
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
