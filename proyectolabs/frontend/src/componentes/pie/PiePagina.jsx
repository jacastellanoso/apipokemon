import "./piePagina.css";
import {
  IconoCorreo,
  IconoFacebook,
  IconoInstagram,
  IconoTelefono,
  IconoUbicacion,
  IconoWhatsapp,
  IconoYoutube,
} from "./iconosPiePagina.jsx";

// Mismos destinos que usa el menú principal (Encabezado/MenuNavegacion.jsx).
const ENLACES_RAPIDOS = [
  { href: "#inicio", texto: "Inicio" },
  { href: "#disponibilidad", texto: "Disponibilidad" },
];

const REDES = [
  { texto: "Facebook", href: "https://www.facebook.com/UniversidadRafaelLandivar/", Icono: IconoFacebook },
  { texto: "Instagram", href: "https://www.instagram.com/u_landivar/?hl=es", Icono: IconoInstagram },
  { texto: "YouTube", href: "https://www.youtube.com/@u_landivar", Icono: IconoYoutube },
  { texto: "WhatsApp", href: "https://wa.me/50254809886", Icono: IconoWhatsapp },
];

export function PiePagina() {
  const anioActual = new Date().getFullYear();

  return (
    <footer className="pie-pagina" id="informacion" data-seccion="informacion">
      <div className="pie-pagina__contenido">
        <div className="pie-pagina__columna pie-pagina__identidad">
          <img src="/identidad/logo-pie.svg" alt="Landívar Facultad" width="1085" height="518" />
          <p className="pie-pagina__descripcion">
            Proyecto Labs — Universidad Rafael Landívar. Consulta la disponibilidad de laboratorios y
            reserva el espacio que tu equipo necesita.
          </p>
        </div>

        <nav className="pie-pagina__columna" aria-label="Enlaces rápidos">
          <h3>Enlaces rápidos</h3>
          <ul className="pie-pagina__lista">
            {ENLACES_RAPIDOS.map(({ href, texto }) => (
              <li key={href}>
                <a href={href}>{texto}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="pie-pagina__columna">
          <h3>Redes</h3>
          <ul className="pie-pagina__redes">
            {REDES.map((red) => (
              <li key={red.texto}>
                <a href={red.href} target="_blank" rel="noopener noreferrer">
                  <span className="pie-pagina__icono-insignia">
                    <red.Icono />
                  </span>
                  {red.texto}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="pie-pagina__columna">
          <h3>Contáctanos</h3>
          <ul className="pie-pagina__contacto">
            <li>
              <IconoUbicacion />
              <span>Campus Central Vista Hermosa III, zona 16, Guatemala</span>
            </li>
            <li>
              <IconoTelefono />
              <a href="tel:+50224262626">(502) 2426-2626</a>
            </li>
            <li>
              <IconoCorreo />
              <a href="mailto:2600@url.edu.gt">2600@url.edu.gt</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="pie-pagina__franja">
        <p>Copyright © {anioActual} - Desarrollado para Proyecto Labs.</p>
      </div>
    </footer>
  );
}
