import Icono from "./Icono";

export default function BotonCerrar({ onClick }: { onClick: () => void }) {
  return <button type="button" className="pokemon-modal__cerrar" aria-label="Cerrar detalles" onClick={onClick} autoFocus><Icono nombre="cerrar" /></button>;
}
