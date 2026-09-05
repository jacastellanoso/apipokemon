import { useCallback, useLayoutEffect, useRef } from "react";
import type { AnimationEvent } from "react";

export function useAnimacionEncabezado() {
  const encabezadoRef = useRef<HTMLElement>(null);
  const transicionRef = useRef<ViewTransition | null>(null);

  const construirEncabezado = useCallback(() => {
    const header = encabezadoRef.current;
    if (!header || document.body.classList.contains("header-ready")) return;
    const aplicarEstado = () => {
      if (!encabezadoRef.current) return;
      document.body.classList.add("header-ready");
      header.classList.add("header-ready");
    };
    const movimientoReducido = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!movimientoReducido.matches && typeof document.startViewTransition === "function") {
      transicionRef.current = document.startViewTransition(aplicarEstado);
      return;
    }
    aplicarEstado();
  }, []);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      construirEncabezado();
    }
    return () => {
      transicionRef.current?.skipTransition();
      document.body.classList.remove("header-ready");
    };
  }, [construirEncabezado]);

  const manejarFinAnimacion = (event: AnimationEvent<HTMLDivElement>) => {
    if (event.animationName === "showBall") construirEncabezado();
  };
  return { encabezadoRef, manejarFinAnimacion };
}
