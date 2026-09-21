import { useCallback, useEffect, useRef, useState } from "react";
import { obtenerSalas } from "../../servicios/salasApi.js";
import { TarjetaLaboratorio } from "./TarjetaLaboratorio.jsx";
import { ModalReserva } from "./ModalReserva.jsx";
import "./franjaLaboratorios.css";

const INTERVALO_AUTOPLAY_MS = 4000;

export function FranjaLaboratorios() {
  const [salas, setSalas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [salaSeleccionadaId, setSalaSeleccionadaId] = useState(null);
  const [salaParaReservar, setSalaParaReservar] = useState(null);
  const [indiceActivo, setIndiceActivo] = useState(0);
  const [pausado, setPausado] = useState(false);
  const pistaRef = useRef(null);
  const temporizadorRef = useRef(null);

  const cargarSalas = useCallback(() => {
    return obtenerSalas()
      .then((datos) => {
        setSalas(datos);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || "Ocurrió un error al cargar los laboratorios.");
      });
  }, []);

  useEffect(() => {
    let activo = true;

    obtenerSalas()
      .then((datos) => {
        if (activo) setSalas(datos);
      })
      .catch((err) => {
        if (activo) setError(err.message || "Ocurrió un error al cargar los laboratorios.");
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, []);

  useEffect(() => {
    setIndiceActivo(0);
  }, [salas]);

  function irAIndice(indice, comportamiento = "smooth") {
    const total = salas.length;
    if (total === 0) return;

    const siguiente = ((indice % total) + total) % total;
    setIndiceActivo(siguiente);

    const nodo = pistaRef.current?.children[siguiente];
    nodo?.scrollIntoView({ behavior: comportamiento, inline: "start", block: "nearest" });
  }

  function irAnterior() {
    irAIndice(indiceActivo - 1);
  }

  function irSiguiente() {
    irAIndice(indiceActivo + 1);
  }

  // El autoplay se reinicia (limpia y vuelve a armar) cada vez que cambia el
  // índice activo o la pausa, así una flecha manual empuja el próximo avance automático.
  useEffect(() => {
    if (temporizadorRef.current) clearInterval(temporizadorRef.current);

    const prefiereMovimientoReducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefiereMovimientoReducido || pausado || Boolean(salaParaReservar) || salas.length <= 1) {
      return undefined;
    }

    temporizadorRef.current = setInterval(() => {
      irAIndice(indiceActivo + 1);
    }, INTERVALO_AUTOPLAY_MS);

    return () => clearInterval(temporizadorRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indiceActivo, pausado, salaParaReservar, salas.length]);

  return (
    <div className="franja-laboratorios">
      <div className="franja-laboratorios__cabecera">
        <p className="franja-laboratorios__subtitulo">Consulta nuestros laboratorios disponibles</p>
        {salas.length > 0 && (
          <div className="franja-laboratorios__flechas">
            <button
              type="button"
              className="franja-laboratorios__flecha"
              onClick={irAnterior}
              aria-label="Ver laboratorio anterior"
            >
              ‹
            </button>
            <button
              type="button"
              className="franja-laboratorios__flecha"
              onClick={irSiguiente}
              aria-label="Ver siguiente laboratorio"
            >
              ›
            </button>
          </div>
        )}
      </div>

      {cargando && <p className="franja-laboratorios__mensaje">Cargando laboratorios...</p>}

      {!cargando && error && (
        <p className="franja-laboratorios__mensaje franja-laboratorios__mensaje--error">
          No pudimos cargar los laboratorios. Intenta nuevamente en unos minutos.
        </p>
      )}

      {!cargando && !error && salas.length === 0 && (
        <p className="franja-laboratorios__mensaje">No hay laboratorios disponibles.</p>
      )}

      {!cargando && !error && salas.length > 0 && (
        <>
          <div
            className="franja-laboratorios__pista"
            ref={pistaRef}
            onMouseEnter={() => setPausado(true)}
            onMouseLeave={() => setPausado(false)}
            onFocus={() => setPausado(true)}
            onBlur={() => setPausado(false)}
            onTouchStart={() => setPausado(true)}
            onTouchEnd={() => setPausado(false)}
          >
            {salas.map((sala) => (
              <TarjetaLaboratorio
                key={sala.id}
                sala={sala}
                seleccionada={sala.id === salaSeleccionadaId}
                alSeleccionar={() =>
                  setSalaSeleccionadaId((actual) => (actual === sala.id ? null : sala.id))
                }
                alReservar={() => setSalaParaReservar(sala)}
              />
            ))}
          </div>

          {salas.length > 1 && (
            <div className="franja-laboratorios__puntos" role="tablist" aria-label="Seleccionar laboratorio">
              {salas.map((sala, indice) => (
                <button
                  key={sala.id}
                  type="button"
                  role="tab"
                  aria-selected={indice === indiceActivo}
                  aria-label={`Ir a ${sala.nombre}`}
                  className={`franja-laboratorios__punto${indice === indiceActivo ? " franja-laboratorios__punto--activo" : ""}`}
                  onClick={() => irAIndice(indice)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {salaParaReservar && (
        <ModalReserva
          sala={salaParaReservar}
          alCerrar={() => setSalaParaReservar(null)}
          alExito={cargarSalas}
        />
      )}
    </div>
  );
}
