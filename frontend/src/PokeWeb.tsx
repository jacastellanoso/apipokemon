import Encabezado from "./componentes/encabezado/Encabezado";
import Estructura from "./componentes/estructura/Estructura";
import Galeria from "./componentes/galeria/Galeria";
import Footer from "./componentes/footer/Footer";
import CursorPokemon from "./componentes/ui/CursorPokemon";

export default function PokeWeb() {
  return (
    <>
      <CursorPokemon />
      <Encabezado />
      <main className="landing-content" id="inicio" tabIndex={-1}>
        <Estructura />
        <Galeria />
      </main>
      <Footer />
    </>
  );
}
