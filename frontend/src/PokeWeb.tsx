import Encabezado from "./componentes/encabezado/Encabezado";
import Estructura from "./componentes/estructura/Estructura";
import Galeria from "./componentes/galeria/Galeria";

export default function PokeWeb() {
  return (
    <>
      <Encabezado />
      <main className="landing-content" id="inicio" tabIndex={-1}>
        <Estructura />
        <Galeria />
      </main>
    </>
  );
}
