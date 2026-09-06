import Icono from "../ui/Icono";
import type { EtapaEvolucion } from "./datosOpcionales";
import TarjetaEvolucion from "./TarjetaEvolucion";

export default function CadenaEvolucion({ evoluciones }: { evoluciones: EtapaEvolucion[][] }) {
  return <section className="pokemon-detalle pokemon-detalle--evolucion">
    <h3><Icono nombre="evolucion" /> Cadena de evolución</h3>
    <div className="pokemon-evoluciones">
      {evoluciones.map((camino) => <ol className="pokemon-evolucion" key={camino.map((etapa) => etapa.id).join("-")} aria-label="Camino de evolución">
        {camino.map((etapa, indice) => <li key={etapa.id} style={{ "--orden": indice } as React.CSSProperties}>
          {indice > 0 && <svg className="evolucion-conector" viewBox="0 0 36 16" aria-hidden="true"><path d="M1 8h30M25 2l6 6-6 6" /></svg>}
          <TarjetaEvolucion etapa={etapa} />
        </li>)}
      </ol>)}
    </div>
  </section>;
}
