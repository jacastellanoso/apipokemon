import Logo from "../encabezado/Logo";
import "./footer.css";

export default function Footer() {
  return <footer className="site-footer" id="informacion">
    <div className="site-footer__linea" aria-hidden="true" />
    <div className="site-footer__contenido">
      <Logo ubicacion="footer" />
      <p>Todos los derechos reservados © 2026 - PokéWeb</p>
    </div>
  </footer>;
}
