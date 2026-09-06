import Icono, { type NombreIcono } from "../ui/Icono";

export default function BotonMenu({ texto, icono, destino, activo, onNavegar }: { texto: string; icono: NombreIcono; destino: string; activo?: boolean; onNavegar?: () => void }) {
  return <a className={activo ? "navigation-link is-active" : "navigation-link"} href={`#${destino}`} aria-current={activo ? "location" : undefined} onClick={onNavegar}>
    <span className="navigation-icon" aria-hidden="true"><Icono nombre={icono} /></span>
    <span className="navigation-label">{texto}</span>
  </a>;
}
