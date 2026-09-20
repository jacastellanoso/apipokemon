import { LogoLandivar } from "../identidad/LogoLandivar.jsx";
import { MenuNavegacion } from "./MenuNavegacion.jsx";
import "./encabezado.css";

export function Encabezado() {
  return (
    <header className="encabezado">
      <a className="encabezado__marca" href="#inicio" aria-label="Landívar Facultad, inicio">
        <LogoLandivar />
      </a>
      <MenuNavegacion />
    </header>
  );
}
