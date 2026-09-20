import "./seccionFormulario.css";

export function SeccionFormulario() {
  return (
    <section className="seccion-formulario" id="disponibilidad" data-seccion="disponibilidad"
      aria-labelledby="titulo-disponibilidad">
      <div className="seccion-formulario__encabezado">
        <p>Reserva de laboratorios</p>
        <h2 id="titulo-disponibilidad">Disponibilidad</h2>
        <span aria-hidden="true" />
      </div>
      <div className="seccion-formulario__espacio" aria-label="Área reservada para el formulario" />
    </section>
  );
}
