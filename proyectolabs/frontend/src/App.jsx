import { useState } from "react";
import { AnimacionLogo } from "./componentes/animacion/AnimacionLogo.jsx";
import { Encabezado } from "./componentes/encabezado/Encabezado.jsx";
import { SeccionFormulario } from "./componentes/formulario/SeccionFormulario.jsx";
import { PiePagina } from "./componentes/pie/PiePagina.jsx";
import { FranjaPresentacion } from "./componentes/presentacion/FranjaPresentacion.jsx";

const CLAVE_INTRO_SESION = "proyecto-labs:intro-sesion";

function debeMostrarIntro() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;

  try {
    if (window.sessionStorage.getItem(CLAVE_INTRO_SESION)) return false;
    window.sessionStorage.setItem(CLAVE_INTRO_SESION, "true");
    return true;
  } catch {
    return true;
  }
}

export default function App() {
  const [mostrarIntro, setMostrarIntro] = useState(debeMostrarIntro);

  function finalizarIntro() {
    setMostrarIntro(false);
  }

  return (
    <div className="aplicacion">
      {mostrarIntro && <AnimacionLogo alFinalizar={finalizarIntro} />}
      <div className={mostrarIntro ? "sitio sitio--esperando" : "sitio sitio--visible"}>
        <Encabezado />
        <main>
          <FranjaPresentacion />
          <SeccionFormulario />
        </main>
        <PiePagina />
      </div>
    </div>
  );
}
