import {
  IconoCapacidad,
  IconoEdificio,
  IconoLaboratorio,
  IconoReservarAccion,
  IconoReservas,
} from "./iconosDisponibilidad.jsx";

// Tarjeta individual de un laboratorio dentro de la franja de disponibilidad.
export function TarjetaLaboratorio({ sala, seleccionada, alSeleccionar, alReservar }) {
  const cantidadReservas = sala.reservas?.length ?? 0;

  return (
    <article className={`tarjeta-lab${seleccionada ? " tarjeta-lab--seleccionada" : ""}`}>
      <button
        type="button"
        className="tarjeta-lab__info"
        onClick={alSeleccionar}
        aria-pressed={seleccionada}
      >
        <div className="tarjeta-lab__encabezado">
          <span className="tarjeta-lab__insignia">
            <IconoLaboratorio />
          </span>
          <p className="tarjeta-lab__nombre">{sala.nombre}</p>
        </div>

        <ul className="tarjeta-lab__datos">
          <li className="tarjeta-lab__dato tarjeta-lab__dato--edificio">
            <IconoEdificio />
            <span>Edificio {sala.edificio}</span>
          </li>
          <li className="tarjeta-lab__dato">
            <IconoCapacidad />
            <span>Capacidad: {sala.capacidad} personas</span>
          </li>
          <li className="tarjeta-lab__dato">
            <IconoReservas />
            <span>
              {cantidadReservas} {cantidadReservas === 1 ? "reserva" : "reservas"}
            </span>
          </li>
        </ul>
      </button>

      <button type="button" className="tarjeta-lab__reservar" onClick={alReservar}>
        <IconoReservarAccion />
        Reservar
      </button>
    </article>
  );
}
