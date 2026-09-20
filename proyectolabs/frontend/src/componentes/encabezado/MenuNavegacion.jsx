import { useEffect, useState } from "react";

const enlaces = [
  { id: "inicio", texto: "Inicio" },
  { id: "disponibilidad", texto: "Disponibilidad" },
  { id: "informacion", texto: "Información" },
];

export function MenuNavegacion() {
  const [abierto, setAbierto] = useState(false);
  const [seccionActiva, setSeccionActiva] = useState("inicio");

  useEffect(() => {
    let cuadroPendiente = false;

    function actualizarSeccion() {
      const alFinal = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (alFinal) {
        setSeccionActiva("informacion");
        cuadroPendiente = false;
        return;
      }

      const puntoLectura = window.scrollY + window.innerHeight * 0.42;
      let actual = "inicio";
      enlaces.forEach(({ id }) => {
        const seccion = document.getElementById(id);
        if (seccion && seccion.offsetTop <= puntoLectura) actual = id;
      });
      setSeccionActiva(actual);
      cuadroPendiente = false;
    }

    function alDesplazar() {
      if (!cuadroPendiente) {
        window.requestAnimationFrame(actualizarSeccion);
        cuadroPendiente = true;
      }
    }

    actualizarSeccion();
    window.addEventListener("scroll", alDesplazar, { passive: true });
    window.addEventListener("resize", alDesplazar);
    return () => {
      window.removeEventListener("scroll", alDesplazar);
      window.removeEventListener("resize", alDesplazar);
    };
  }, []);

  return (
    <div className="navegacion">
      <button className="navegacion__interruptor" type="button" aria-expanded={abierto}
        aria-controls="menu-principal" onClick={() => setAbierto((actual) => !actual)}>
        <span>Menú</span>
        <span className="navegacion__icono" aria-hidden="true"><i /><i /></span>
      </button>
      <nav className={`menu ${abierto ? "menu--abierto" : ""}`} id="menu-principal" aria-label="Menú principal">
        {enlaces.map(({ id, texto }) => (
          <a key={id} className={`menu__franja ${seccionActiva === id ? "menu__franja--activa" : ""}`}
            href={`#${id}`} aria-current={seccionActiva === id ? "page" : undefined}
            onClick={() => { setAbierto(false); setSeccionActiva(id); }}>
            {texto}
          </a>
        ))}
      </nav>
    </div>
  );
}
