import Icono from "../ui/Icono";
import { formatearNombre } from "./servicioPokemon";

export default function FiltrosPokemon({ tipos, activo, onCambiar }: { tipos: string[]; activo: string; onCambiar: (tipo: string) => void }) {
  return <div className="galeria-filtros" aria-label="Filtrar por tipo">
    <span className="galeria-filtros__titulo"><Icono nombre="filtro" /> Filtros</span>
    <div className="galeria-filtros__lista">
      {["todos", ...tipos].map((tipo) => <button key={tipo} type="button" className={activo === tipo ? "is-active" : ""} aria-pressed={activo === tipo} onClick={() => onCambiar(tipo)}>{tipo === "todos" ? "Todos" : formatearNombre(tipo)}</button>)}
    </div>
  </div>;
}
