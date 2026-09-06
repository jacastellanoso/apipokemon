import EtiquetaTipo from "./EtiquetaTipo";

import { useState } from "react";
import { formatearNombre } from "./servicioPokemon";
import type { Pokemon } from "./servicioPokemon";

export default function TarjetaPokemon({ pokemon, onSeleccionar }: { pokemon: Pokemon; onSeleccionar: (pokemon: Pokemon) => void }) {
  const [imagenFallida, setImagenFallida] = useState<string | null>(null);
  return (
    <li className="pokemon-tarjeta">
      <span className="pokemon-tarjeta__numero">#{String(pokemon.id).padStart(3, "0")}</span>
      <div className="pokemon-tarjeta__ilustracion">
        {pokemon.imagen && imagenFallida !== pokemon.imagen ? (
          <img
            src={pokemon.imagen}
            alt={formatearNombre(pokemon.nombre)}
            width={240}
            height={240}
            loading="lazy"
            decoding="async"
            onError={() => setImagenFallida(pokemon.imagen)}
          />
        ) : (
          <span className="pokemon-tarjeta__sin-imagen">Imagen no disponible</span>
        )}
      </div>
      <h3>{formatearNombre(pokemon.nombre)}</h3>
      {pokemon.tipos.length > 0 && (
        <ul className="pokemon-tarjeta__tipos" aria-label="Tipos">
          {[...new Set(pokemon.tipos)].map((tipo) => (
            <li key={tipo}><EtiquetaTipo tipo={tipo} /></li>
          ))}
        </ul>
      )}
      <button type="button" className="pokemon-tarjeta__seleccionar" aria-label={"Ver detalles de " + formatearNombre(pokemon.nombre)} aria-haspopup="dialog" onClick={() => onSeleccionar(pokemon)} />
    </li>
  );
}
