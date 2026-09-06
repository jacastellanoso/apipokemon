/** Contrato propuesto: estos campos NO existen todavía en el backend actual. */
export const ESTADISTICAS = [
  ["hp", "PS / HP"],
  ["ataque", "Ataque"],
  ["defensa", "Defensa"],
  ["ataqueEspecial", "Ataque especial"],
  ["defensaEspecial", "Defensa especial"],
  ["velocidad", "Velocidad"],
] as const;

export type Estadisticas = Partial<Record<(typeof ESTADISTICAS)[number][0], number>>;
export interface Debilidad { tipo: string; multiplicador: number }
export interface EtapaEvolucion { id: number; nombre: string; imagen?: string }
export interface DatosOpcionales {
  estadisticas?: Estadisticas;
  debilidades?: Debilidad[];
  // Cada camino completo viene ordenado de primera a última etapa.
  // Las evoluciones ramificadas usan caminos separados, nunca una cadena falsa.
  evoluciones?: EtapaEvolucion[][];
}

function esObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null && !Array.isArray(valor);
}

export function leerOpcionales(dato: Record<string, unknown>): DatosOpcionales {
  const resultado: DatosOpcionales = {};
  if (esObjeto(dato.estadisticas)) {
    const estadisticas: Estadisticas = {};
    for (const [clave] of ESTADISTICAS) {
      const valor = dato.estadisticas[clave];
      if (typeof valor === "number" && Number.isSafeInteger(valor) && valor >= 0) {
        estadisticas[clave] = valor;
      }
    }
    if (Object.keys(estadisticas).length) resultado.estadisticas = estadisticas;
  }
  if (Array.isArray(dato.debilidades)) {
    const validas = dato.debilidades.filter((valor): valor is Debilidad =>
      esObjeto(valor) && typeof valor.tipo === "string" && !!valor.tipo.trim() &&
      typeof valor.multiplicador === "number" && Number.isFinite(valor.multiplicador) &&
      valor.multiplicador > 1);
    resultado.debilidades = [...new Map(validas.map((valor) =>
      [valor.tipo, { tipo: valor.tipo, multiplicador: valor.multiplicador }])).values()];
  }
  if (Array.isArray(dato.evoluciones)) {
    const caminos = dato.evoluciones.filter((camino): camino is EtapaEvolucion[] =>
      Array.isArray(camino) && camino.length > 0 && camino.every((etapa) =>
        esObjeto(etapa) && typeof etapa.id === "number" && Number.isSafeInteger(etapa.id) &&
        etapa.id > 0 && typeof etapa.nombre === "string" && !!etapa.nombre.trim() &&
        (etapa.imagen === undefined || (typeof etapa.imagen === "string" && !!etapa.imagen.trim()))) &&
      new Set(camino.map((etapa) => etapa.id)).size === camino.length);
    resultado.evoluciones = [...new Map(caminos.map((camino) =>
      [camino.map((etapa) => etapa.id).join("-"), camino.map(({ id, nombre, imagen }) => ({ id, nombre, ...(imagen ? { imagen } : {}) }))])).values()];
  }
  return resultado;
}
