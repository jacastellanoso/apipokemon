import Logo, { FiltrosLogo } from "./Logo";
import FondoAnimado from "./FondoAnimado";
import Pokebola from "./Pokebola";
import Menu from "./Menu";
import { useAnimacionEncabezado } from "./animacionEncabezado";

export default function Encabezado() {
  const { encabezadoRef, manejarFinAnimacion } = useAnimacionEncabezado();
  return (
    <>
      <FiltrosLogo />
      <FondoAnimado />
      <header ref={encabezadoRef} className="scene site-header">
        <Logo />
        <Pokebola onAnimationEnd={manejarFinAnimacion} />
        <Menu />
      </header>
    </>
  );
}
