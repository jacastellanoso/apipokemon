const ICONOS_TIPO: Record<string, string> = {
  normal: "fi-rr-circle",
  fire: "fi-rr-flame",
  water: "fi-rr-raindrops",
  electric: "fi-rr-bolt",
  grass: "fi-rr-leaf",
  ice: "fi-rr-snowflake",
  fighting: "fi-rr-hand-fist",
  poison: "fi-rr-skull-crossbones",
  ground: "fi-rr-mountain",
  flying: "fi-rr-wind",
  psychic: "fi-rr-eye",
  bug: "fi-rr-bug",
  rock: "fi-rr-gem",
  ghost: "fi-rr-ghost",
  dragon: "fi-rr-dragon",
  dark: "fi-rr-moon",
  steel: "fi-rr-shield",
  fairy: "fi-rr-sparkles",
};

export default function IconoTipo({ tipo }: { tipo: string }) {
  return <i className={`fi ${ICONOS_TIPO[tipo.toLowerCase()] ?? "fi-rr-circle"} pokemon-tipo__icono`} aria-hidden="true" />;
}
