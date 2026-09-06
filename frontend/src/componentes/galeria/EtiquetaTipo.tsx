import type { CSSProperties, ReactNode } from "react";
import { formatearNombre } from "./servicioPokemon";

// Traducciones y colores de presentación; no calculan relaciones entre tipos.
const TIPOS: Record<string, [string, string, string]> = {
  normal: ["Normal", "#e6e5df", "#393b30"],
  fire: ["Fuego", "#ffe0cc", "#8a3208"],
  water: ["Agua", "#d8eaff", "#154e88"],
  electric: ["Eléctrico", "#fff1ad", "#604b00"],
  grass: ["Planta", "#dceec7", "#31551c"],
  ice: ["Hielo", "#d3f2f2", "#20565b"],
  fighting: ["Lucha", "#f8d5cf", "#842b20"],
  poison: ["Veneno", "#ebd9f4", "#64367b"],
  ground: ["Tierra", "#eee0bc", "#614c1e"],
  flying: ["Volador", "#e1e5fc", "#414b80"],
  psychic: ["Psíquico", "#fbd5e4", "#8a2750"],
  bug: ["Bicho", "#e6edbf", "#4c5b14"],
  rock: ["Roca", "#e8e0ca", "#5c4e27"],
  ghost: ["Fantasma", "#e3ddf0", "#51406f"],
  dragon: ["Dragón", "#dedafd", "#493c91"],
  dark: ["Siniestro", "#ded8d4", "#453a34"],
  steel: ["Acero", "#e0e7ec", "#3f5260"],
  fairy: ["Hada", "#f9dfee", "#803c66"],
};

export default function EtiquetaTipo({ tipo, children }: { tipo: string; children?: ReactNode }) {
  const [nombre, fondo, texto] = TIPOS[tipo.toLowerCase()] ?? [formatearNombre(tipo), "#eaf0fb", "#24427b"];
  return (
    <span className="pokemon-tipo" style={{ "--tipo-fondo": fondo, "--tipo-texto": texto } as CSSProperties}>
      {nombre}{children}
    </span>
  );
}
