export type NombreIcono = "buscar" | "filtro" | "abrir" | "cerrar" | "evolucion" | "estadisticas" | "alerta" | "inicio" | "galeria" | "informacion";

const CLASES: Record<NombreIcono, string> = {
  buscar: "fi-rr-search", filtro: "fi-rr-bars-filter", abrir: "fi-rr-arrow-right",
  cerrar: "fi-rr-cross-small", evolucion: "fi-rr-diagram-project",
  estadisticas: "fi-rr-chart-histogram", alerta: "fi-rr-shield-exclamation",
  inicio: "fi-rr-home", galeria: "fi-rr-apps", informacion: "fi-rr-info",
};

export default function Icono({ nombre, className = "" }: { nombre: NombreIcono; className?: string }) {
  return <i className={`fi ${CLASES[nombre]} ${className}`.trim()} aria-hidden="true" />;
}
