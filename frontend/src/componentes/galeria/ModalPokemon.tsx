import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import DetallesPokemon from "./DetallesPokemon";
import EtiquetaTipo from "./EtiquetaTipo";
import { formatearNombre } from "./servicioPokemon";
import type { Pokemon } from "./servicioPokemon";
import BotonCerrar from "../ui/BotonCerrar";

export default function ModalPokemon({ pokemon, onCerrar }: { pokemon: Pokemon; onCerrar: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inicioFuera = useRef(false);
  const tituloId = useId();
  const [imagenFallida, setImagenFallida] = useState(false);
  const tieneDetalles = !!(pokemon.debilidades?.length || pokemon.evoluciones?.length ||
    (pokemon.estadisticas && Object.keys(pokemon.estadisticas).length));

  useEffect(() => {
    const dialog = dialogRef.current!;
    const anterior = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      anterior?.focus({ preventScroll: true });
    };
  }, []);

  function fuera(x: number, y: number) {
    const rect = dialogRef.current!.getBoundingClientRect();
    return x < rect.left || x > rect.right || y < rect.top || y > rect.bottom;
  }

  return createPortal(
    <dialog
      ref={dialogRef}
      className={"pokemon-modal" + (tieneDetalles ? " pokemon-modal--completo" : "")}
      aria-labelledby={tituloId}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const controles = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]',
        ));
        const primero = controles[0];
        const ultimo = controles[controles.length - 1];
        if (event.shiftKey && document.activeElement === primero) {
          event.preventDefault();
          ultimo?.focus();
        } else if (!event.shiftKey && document.activeElement === ultimo) {
          event.preventDefault();
          primero?.focus();
        }
      }}
      onCancel={(event) => { event.preventDefault(); onCerrar(); }}
      onPointerDown={(event) => { inicioFuera.current = fuera(event.clientX, event.clientY); }}
      onClick={(event) => {
        if (event.target === event.currentTarget && inicioFuera.current && fuera(event.clientX, event.clientY)) onCerrar();
      }}
    >
      <header className="pokemon-modal__cabecera">
        <div>
          <p className="pokemon-tarjeta__numero">ARCHIVO #{String(pokemon.id).padStart(3, "0")}</p>
          <h2 id={tituloId}>{formatearNombre(pokemon.nombre)}</h2>
        </div>
        <BotonCerrar onClick={onCerrar} />
      </header>
      <div className="pokemon-modal__contenido">
        <div className="pokemon-modal__resumen">
          <span className="pokemon-modal__escaneo" aria-hidden="true">ANÁLISIS BIOMÉTRICO</span>
          <div className="pokemon-modal__imagen">
            {pokemon.imagen && !imagenFallida ? (
              <img src={pokemon.imagen} alt={formatearNombre(pokemon.nombre)} width={240} height={240} draggable={false} onError={() => setImagenFallida(true)} />
            ) : <p className="pokemon-tarjeta__sin-imagen">Imagen no disponible</p>}
          </div>
          {!!pokemon.tipos.length && (
            <ul className="pokemon-tarjeta__tipos" aria-label="Tipos">
              {[...new Set(pokemon.tipos)].map((tipo) => <li key={tipo}><EtiquetaTipo tipo={tipo} /></li>)}
            </ul>
          )}
        </div>
        {tieneDetalles && <div className="pokemon-modal__detalles"><DetallesPokemon pokemon={pokemon} /></div>}
      </div>
    </dialog>,
    document.body,
  );
}
