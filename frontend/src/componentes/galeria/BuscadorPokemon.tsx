import Icono from "../ui/Icono";

export default function BuscadorPokemon({ valor, onCambiar }: { valor: string; onCambiar: (valor: string) => void }) {
  return <label className="galeria-buscador">
    <span className="visually-hidden">Buscar Pokémon por nombre o número</span>
    <Icono nombre="buscar" />
    <input type="search" value={valor} onChange={(evento) => onCambiar(evento.target.value)} placeholder="Buscar por nombre o número" />
  </label>;
}
