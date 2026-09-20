import "./franjaPresentacion.css";

export function FranjaPresentacion() {
  return (
    <section className="franja-presentacion" id="inicio" data-seccion="inicio" aria-labelledby="titulo-proyecto">
      <div className="franja-presentacion__contenido">
        <p className="franja-presentacion__etiqueta">Proyecto Labs</p>
        <h1 id="titulo-proyecto">Tu próximo gran proyecto empieza en un lab.</h1>
        <p>Consulta la disponibilidad y reserva el espacio que tu equipo necesita, sin vueltas ni correos de más.</p>
      </div>
    </section>
  );
}
