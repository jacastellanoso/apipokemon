import { useEffect } from "react";

export default function CursorPokemon() {
  useEffect(() => {
    const activar = () => document.body.classList.add("cursor-pokebola--activo");
    const desactivar = () => document.body.classList.remove("cursor-pokebola--activo");
    window.addEventListener("pointerdown", activar);
    window.addEventListener("pointerup", desactivar);
    window.addEventListener("pointercancel", desactivar);
    window.addEventListener("blur", desactivar);
    return () => {
      window.removeEventListener("pointerdown", activar);
      window.removeEventListener("pointerup", desactivar);
      window.removeEventListener("pointercancel", desactivar);
      window.removeEventListener("blur", desactivar);
      desactivar();
    };
  }, []);
  return null;
}
