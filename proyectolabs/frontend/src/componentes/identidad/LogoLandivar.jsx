export function LogoLandivar({ variante = "encabezado" }) {
  return (
    <img
      className={`logo-landivar logo-landivar--${variante}`}
      src="/identidad/logo-landivar.svg"
      alt="Landívar Facultad"
      width="1085"
      height="518"
    />
  );
}
