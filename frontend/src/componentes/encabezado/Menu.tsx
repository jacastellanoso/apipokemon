import { useEffect, useRef, useState } from "react";

export default function Menu() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const botonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const manejarTecla = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuAbierto(false);
        botonRef.current?.focus();
      }
    };
    const manejarResize = () => {
      if (window.innerWidth > 700) setMenuAbierto(false);
    };
    document.addEventListener("keydown", manejarTecla);
    window.addEventListener("resize", manejarResize);
    return () => {
      document.removeEventListener("keydown", manejarTecla);
      window.removeEventListener("resize", manejarResize);
    };
  }, []);

  return (
<nav className="header-navigation" aria-label="Navegaci&oacute;n principal">
    <button ref={botonRef} onClick={() => setMenuAbierto(abierto => !abierto)} className="menu-toggle" type="button" aria-expanded={menuAbierto} aria-controls="primary-menu"
            aria-label={menuAbierto ? "Cerrar menú principal" : "Abrir menú principal"}>
      <span className="menu-toggle-lines" aria-hidden="true"></span>
      <span className="visually-hidden">Abrir men&uacute; principal</span>
    </button>
    <ul className={menuAbierto ? "navigation-list is-open" : "navigation-list"} id="primary-menu">
      <li>
        <a className="navigation-link" href="#inicio" aria-current="page">
          <span className="navigation-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" role="img" focusable="false">
              <path fill="currentColor"
                    d="M12 2.8l2.57 5.21 5.75.84-4.16 4.05.98 5.72L12 15.92l-5.14 2.70.98-5.72-4.16-4.05 5.75-.84L12 2.8z"/>
            </svg>
          </span>
          <span className="navigation-label">Inicio</span>
        </a>
      </li>
    </ul>
  </nav>
  );
}
