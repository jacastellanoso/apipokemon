import { useEffect, useRef, useState } from "react";
import BotonMenu from "../menu/BotonMenu";

export default function Menu() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const botonRef = useRef<HTMLButtonElement>(null);
  const [activo, setActivo] = useState("inicio");
  const bloqueoHasta = useRef(0);

  useEffect(() => {
    const manejarTecla = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuAbierto(false);
        botonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", manejarTecla);
    return () => {
      document.removeEventListener("keydown", manejarTecla);
    };
  }, []);

  useEffect(() => {
    let frame = 0;
    const establecerActivo = (seccion: string) => setActivo((actual) => actual === seccion ? actual : seccion);
    const actualizar = () => {
      frame = 0;
      if (performance.now() < bloqueoHasta.current) return;
      const altura = document.documentElement.scrollHeight;
      const umbral = Math.max(80, window.innerHeight * .08);
      if (window.scrollY <= umbral) return establecerActivo("inicio");
      if (window.innerHeight + window.scrollY >= altura - umbral) return establecerActivo("informacion");
      const galeria = document.getElementById("galeria");
      const informacion = document.getElementById("informacion");
      const linea = window.scrollY + window.innerHeight * .38;
      if (informacion && linea >= informacion.offsetTop) establecerActivo("informacion");
      else if (galeria && linea >= galeria.offsetTop) establecerActivo("galeria");
      else establecerActivo("inicio");
    };
    const solicitarActualizacion = () => { if (!frame) frame = requestAnimationFrame(actualizar); };
    const manejarResize = () => {
      if (window.innerWidth > 700) setMenuAbierto(false);
      solicitarActualizacion();
    };
    actualizar();
    window.addEventListener("scroll", solicitarActualizacion, { passive: true });
    window.addEventListener("resize", manejarResize);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", solicitarActualizacion);
      window.removeEventListener("resize", manejarResize);
    };
  }, []);

  const navegar = (destino: string) => {
    setActivo(destino);
    setMenuAbierto(false);
    bloqueoHasta.current = performance.now() + (window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 850);
  };

  return (
<nav className="header-navigation" aria-label="Navegaci&oacute;n principal">
    <button ref={botonRef} onClick={() => setMenuAbierto(abierto => !abierto)} className="menu-toggle" type="button" aria-expanded={menuAbierto} aria-controls="primary-menu"
            aria-label={menuAbierto ? "Cerrar menú principal" : "Abrir menú principal"}>
      <span className="menu-toggle-lines" aria-hidden="true"></span>
      <span className="visually-hidden">Abrir men&uacute; principal</span>
    </button>
    <ul className={menuAbierto ? "navigation-list is-open" : "navigation-list"} id="primary-menu">
      <li><BotonMenu texto="Inicio" icono="inicio" destino="inicio" activo={activo === "inicio"} onNavegar={() => navegar("inicio")} /></li>
      <li><BotonMenu texto="Galería" icono="galeria" destino="galeria" activo={activo === "galeria"} onNavegar={() => navegar("galeria")} /></li>
      <li><BotonMenu texto="Información" icono="informacion" destino="informacion" activo={activo === "informacion"} onNavegar={() => navegar("informacion")} /></li>
    </ul>
  </nav>
  );
}
