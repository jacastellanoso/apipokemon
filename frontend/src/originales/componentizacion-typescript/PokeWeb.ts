import { crearEncabezado, iniciarEncabezado } from "./componentes/encabezado/Encabezado";

export function montarPokeWeb(): void {
  const pagina = crearEncabezado();
  const header = pagina.querySelector<HTMLElement>(".site-header");
  if (!header) throw new Error("No se encontró el encabezado de PokeWeb.");

  const contenido = document.createElement("template");
  contenido.innerHTML = `<main class="landing-content" id="inicio" tabindex="-1"></main>

`;
  pagina.append(contenido.content);
  // El fragmento conserva los hijos directos de body y su distribución original.
  document.body.append(pagina);
  iniciarEncabezado(header);
}
