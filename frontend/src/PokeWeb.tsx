import Encabezado from "./componentes/encabezado/Encabezado";
import Estructura from "./componentes/estructura/Estructura";

export default function PokeWeb() {
  return (
    <>
      <Encabezado />
      <main className="landing-content" id="inicio" tabIndex={-1}>
        <Estructura />
      </main>
    </>
  );
}
