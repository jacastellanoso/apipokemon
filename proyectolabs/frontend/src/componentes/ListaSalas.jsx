function formatearFecha(fecha) {
  return new Intl.DateTimeFormat("es-GT", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(fecha));
}

export function ListaSalas({ salas, cargando, error, alReintentar }) {
  if (cargando) {
    return <p className="estado" role="status">Cargando laboratorios…</p>;
  }

  if (error) {
    return (
      <div className="estado estado--error" role="alert">
        <p>{error}</p>
        <button className="boton boton--secundario" type="button" onClick={alReintentar}>
          Intentar de nuevo
        </button>
      </div>
    );
  }

  if (!salas.length) {
    return <p className="estado">Todavía no hay laboratorios registrados.</p>;
  }

  return (
    <div className="salas">
      {salas.map((sala, indice) => (
        <article className="sala" key={sala.id}>
          <div className="sala__numero" aria-hidden="true">{String(indice + 1).padStart(2, "0")}</div>
          <div className="sala__contenido">
            <div className="sala__cabecera">
              <div>
                <p className="sala__edificio">{sala.edificio}</p>
                <h3>{sala.nombre}</h3>
              </div>
              <span className="capacidad">{sala.capacidad} personas</span>
            </div>
            <div className="reservas">
              <p className="reservas__titulo">Próximas reservas</p>
              {sala.reservas?.length ? (
                <ul>
                  {sala.reservas.map((reserva) => (
                    <li key={reserva.id}>
                      <span>{formatearFecha(reserva.inicio)}</span>
                      <strong>{reserva.responsable}</strong>
                      <span>{reserva.motivo}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="reservas__vacio">Sin reservas. El horario está libre.</p>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
