import { useCallback, useEffect, useRef, useState } from "react";
import { LogoLandivar } from "../identidad/LogoLandivar.jsx";
import "./animacionLogo.css";

const DURACION_ANIMACION = 6800;
const DURACION_SALIDA = 550;

export function AnimacionLogo({ alFinalizar }) {
  const [saliendo, setSaliendo] = useState(false);
  const finalizando = useRef(false);

  const finalizar = useCallback(() => {
    if (finalizando.current) return;
    finalizando.current = true;
    setSaliendo(true);
    window.setTimeout(alFinalizar, DURACION_SALIDA);
  }, [alFinalizar]);

  useEffect(() => {
    const temporizador = window.setTimeout(finalizar, DURACION_ANIMACION);
    return () => window.clearTimeout(temporizador);
  }, [finalizar]);

  return (
    <section className={`intro ${saliendo ? "intro--saliendo" : ""}`}
      aria-label="Presentación de Landívar Facultad" aria-live="polite">
      <div className="intro__anillos" aria-hidden="true" />
      <div className="intro__luz" aria-hidden="true" />
      <div className="intro__marca">
        <div className="intro__jaguar" aria-hidden="true">
          <img src="/identidad/jaguar-landivar.svg" alt="" />
        </div>
        <LogoLandivar variante="intro" />
      </div>
      <div className="intro__carga" aria-hidden="true"><span /></div>
    </section>
  );
}
