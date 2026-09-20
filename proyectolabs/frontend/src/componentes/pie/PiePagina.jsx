import "./piePagina.css";

export function PiePagina() {
  return (
    <footer className="pie-pagina" id="informacion" data-seccion="informacion">
      <img src="/identidad/logo-pie.svg" alt="Landívar Facultad" width="1085" height="518" />
      <div className="pie-pagina__informacion">
        <p>Información</p>
        <span>Proyecto Labs</span>
      </div>
    </footer>
  );
}
