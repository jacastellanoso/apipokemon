import { useState } from "react";
import type { EtapaEvolucion } from "./datosOpcionales";
import { formatearNombre } from "./servicioPokemon";

export default function TarjetaEvolucion({ etapa }: { etapa: EtapaEvolucion }) {
  const [error, setError] = useState(false);
  return <article className="evolucion-tarjeta">
    <span className="evolucion-tarjeta__numero">#{String(etapa.id).padStart(3, "0")}</span>
    <div className="evolucion-tarjeta__imagen">
      {etapa.imagen && !error ? <img src={etapa.imagen} alt="" width="96" height="96" loading="lazy" draggable={false} onError={() => setError(true)} /> : <span aria-hidden="true" />}
    </div>
    <strong>{formatearNombre(etapa.nombre)}</strong>
  </article>;
}
