import { useCallback, useLayoutEffect, useRef } from "react";
import type { AnimationEvent } from "react";

const CLAVE_INTRO = "pokeweb_intro_vista";

export function useAnimacionEncabezado() {
  const encabezadoRef = useRef<HTMLElement>(null);
  const construirEncabezado = useCallback(() => {
    const header = encabezadoRef.current;
    if (!header || document.body.classList.contains("header-ready")) return;
    const aplicarEstado = () => {
      if (!encabezadoRef.current) return;
      document.body.classList.add("header-ready");
      header.classList.add("header-ready");
      try { sessionStorage.setItem(CLAVE_INTRO, "1"); } catch { /* El almacenamiento puede estar restringido. */ }
    };
    aplicarEstado();
  }, []);

  useLayoutEffect(() => {
    let introVista = false;
    try { introVista = sessionStorage.getItem(CLAVE_INTRO) === "1"; } catch { /* Continúa con la intro. */ }
    if (introVista || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      construirEncabezado();
    }
    return () => {
      document.body.classList.remove("header-ready");
    };
  }, [construirEncabezado]);

  const manejarFinAnimacion = (event: AnimationEvent<HTMLDivElement>) => {
    if (event.animationName === "showBall") construirEncabezado();
  };
  return { encabezadoRef, manejarFinAnimacion };
}
