import { crearFiltrosLogo, crearLogo } from "./Logo";
import { crearFondoAnimado } from "./FondoAnimado";
import { crearPokebola } from "./Pokebola";
import { crearMenu, iniciarMenu } from "./Menu";
import { iniciarAnimacionEncabezado } from "./animacionEncabezado";

export function crearEncabezado(): DocumentFragment {
  const template = document.createElement("template");
  // Solo marcado local y constante; no insertar datos de usuarios ni de APIs aquí.
  template.innerHTML = crearFiltrosLogo() + crearFondoAnimado()
    + `<header class="scene site-header">

  ` + crearLogo() + crearPokebola()
    + crearMenu() + `</header>
`;
  return template.content;
}

export function iniciarEncabezado(header: HTMLElement): void {
  iniciarAnimacionEncabezado(header);
  iniciarMenu(header);
}
