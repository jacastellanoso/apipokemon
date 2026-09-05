import Encabezado from "./componentes/encabezado/Encabezado";

export default function PokeWeb() {
  return (
    <>
      <Encabezado />
      <main className="landing-content" id="inicio" tabIndex={-1}></main>
    </>
  );
}
