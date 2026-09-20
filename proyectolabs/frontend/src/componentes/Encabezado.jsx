export function Encabezado({ cantidad }) {
  return (
    <header className="hero">
      <nav className="nav" aria-label="Navegación principal">
        <a className="marca" href="#inicio" aria-label="Reserva Labs, inicio">
          <span className="marca__simbolo" aria-hidden="true">RL</span>
          <span>Reserva Labs</span>
        </a>
        <a className="nav__enlace" href="#reservar">Nueva reserva</a>
      </nav>

      <div className="hero__contenido" id="inicio">
        <p className="eyebrow">Espacios para crear</p>
        <h1>Tu próximo gran proyecto empieza en un lab.</h1>
        <p className="hero__texto">
          Consulta la disponibilidad y reserva el espacio que tu equipo necesita,
          sin vueltas ni correos de más.
        </p>
        <div className="hero__dato" aria-live="polite">
          <strong>{cantidad}</strong>
          <span>{cantidad === 1 ? "laboratorio disponible" : "laboratorios disponibles"}</span>
        </div>
      </div>
    </header>
  );
}
