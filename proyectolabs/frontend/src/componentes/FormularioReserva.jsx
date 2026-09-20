function CampoError({ id, mensajes }) {
  if (!mensajes?.length) return null;
  return <span className="campo__error" id={id} role="alert">{mensajes[0]}</span>;
}

export function FormularioReserva({
  salas,
  salaId,
  form,
  errores,
  enviando,
  mensaje,
  alCambiarSala,
  alCambiarCampo,
  alEnviar,
}) {
  const descripcionError = (campo) => errores[campo] ? `${campo}-error` : undefined;

  return (
    <section className="panel-formulario" id="reservar" aria-labelledby="titulo-reserva">
      <div className="panel-formulario__intro">
        <p className="eyebrow">Aparta tu espacio</p>
        <h2 id="titulo-reserva">Nueva reserva</h2>
        <p>Completa los datos. Validamos primero aquí y el servidor vuelve a comprobarlos.</p>
      </div>

      <form className="formulario" onSubmit={alEnviar} noValidate>
        <div className="campo campo--completo">
          <label htmlFor="sala">Laboratorio</label>
          <select
            id="sala"
            value={salaId}
            onChange={(evento) => alCambiarSala(evento.target.value)}
            aria-invalid={Boolean(errores.salaId)}
            aria-describedby={descripcionError("salaId")}
          >
            <option value="">Elige un laboratorio</option>
            {salas.map((sala) => <option key={sala.id} value={sala.id}>{sala.nombre}</option>)}
          </select>
          <CampoError id="salaId-error" mensajes={errores.salaId} />
        </div>

        <div className="campo">
          <label htmlFor="responsable">Responsable</label>
          <input id="responsable" name="responsable" autoComplete="name" placeholder="Tu nombre"
            value={form.responsable} onChange={alCambiarCampo}
            aria-invalid={Boolean(errores.responsable)} aria-describedby={descripcionError("responsable")} />
          <CampoError id="responsable-error" mensajes={errores.responsable} />
        </div>

        <div className="campo">
          <label htmlFor="motivo">Motivo</label>
          <input id="motivo" name="motivo" placeholder="¿Para qué usarán el lab?"
            value={form.motivo} onChange={alCambiarCampo}
            aria-invalid={Boolean(errores.motivo)} aria-describedby={descripcionError("motivo")} />
          <CampoError id="motivo-error" mensajes={errores.motivo} />
        </div>

        <div className="campo">
          <label htmlFor="inicio">Inicio</label>
          <input id="inicio" name="inicio" type="datetime-local" value={form.inicio}
            onChange={alCambiarCampo} aria-invalid={Boolean(errores.inicio)}
            aria-describedby={descripcionError("inicio")} />
          <CampoError id="inicio-error" mensajes={errores.inicio} />
        </div>

        <div className="campo">
          <label htmlFor="fin">Fin</label>
          <input id="fin" name="fin" type="datetime-local" value={form.fin}
            onChange={alCambiarCampo} aria-invalid={Boolean(errores.fin)}
            aria-describedby={descripcionError("fin")} />
          <CampoError id="fin-error" mensajes={errores.fin} />
        </div>

        <button className="boton campo--completo" type="submit" disabled={enviando || !salas.length}>
          {enviando ? "Creando reserva…" : "Confirmar reserva"}
        </button>
        {mensaje && <p className={`mensaje mensaje--${mensaje.tipo}`} role="status">{mensaje.texto}</p>}
      </form>
    </section>
  );
}
