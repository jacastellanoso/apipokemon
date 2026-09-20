import { useCallback, useEffect, useState } from "react";
import { Encabezado } from "./componentes/Encabezado.jsx";
import { FormularioReserva } from "./componentes/FormularioReserva.jsx";
import { ListaSalas } from "./componentes/ListaSalas.jsx";
import { reservaSchema } from "./reservaSchema.js";
import { crearReserva, obtenerSalas } from "./servicios/salasApi.js";

const camposIniciales = { responsable: "", motivo: "", inicio: "", fin: "" };

export default function App() {
  const [salas, setSalas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [salaId, setSalaId] = useState("");
  const [form, setForm] = useState(camposIniciales);
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const cargarSalas = useCallback(async (signal) => {
    setCargando(true);
    setError("");
    try {
      const datos = await obtenerSalas({ signal });
      setSalas(Array.isArray(datos) ? datos : []);
    } catch (errorPeticion) {
      if (errorPeticion.name !== "AbortError") setError(errorPeticion.message);
    } finally {
      if (!signal?.aborted) setCargando(false);
    }
  }, []);

  useEffect(() => {
    const controlador = new AbortController();
    cargarSalas(controlador.signal);
    return () => controlador.abort();
  }, [cargarSalas]);

  function cambiarCampo(evento) {
    const { name, value } = evento.target;
    setForm((actual) => ({ ...actual, [name]: value }));
    setErrores((actual) => ({ ...actual, [name]: undefined }));
  }

  async function reservar(evento) {
    evento.preventDefault();
    setMensaje(null);
    const nuevosErrores = salaId ? {} : { salaId: ["Elige un laboratorio."] };
    const revision = reservaSchema.safeParse(form);

    if (!revision.success) Object.assign(nuevosErrores, revision.error.flatten().fieldErrors);
    if (Object.keys(nuevosErrores).length) {
      setErrores(nuevosErrores);
      return;
    }

    setErrores({});
    setEnviando(true);
    try {
      await crearReserva(salaId, form);
      setMensaje({ tipo: "exito", texto: "Reserva creada correctamente." });
      setForm(camposIniciales);
      await cargarSalas();
    } catch (errorPeticion) {
      if (errorPeticion.status === 400 && errorPeticion.detalles) {
        setErrores(errorPeticion.detalles);
      } else {
        setMensaje({ tipo: "error", texto: errorPeticion.message });
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <Encabezado cantidad={salas.length} />
      <main>
        <section className="seccion-labs" aria-labelledby="titulo-labs">
          <div className="seccion-titulo">
            <div>
              <p className="eyebrow">Explora los espacios</p>
              <h2 id="titulo-labs">Laboratorios</h2>
            </div>
            <p>Encuentra el espacio ideal y revisa sus próximas actividades.</p>
          </div>
          <ListaSalas salas={salas} cargando={cargando} error={error} alReintentar={() => cargarSalas()} />
        </section>

        <FormularioReserva salas={salas} salaId={salaId} form={form} errores={errores}
          enviando={enviando} mensaje={mensaje} alCambiarSala={(id) => {
            setSalaId(id);
            setErrores((actual) => ({ ...actual, salaId: undefined }));
          }} alCambiarCampo={cambiarCampo} alEnviar={reservar} />
      </main>
      <footer><p>Reserva Labs · Los datos se protegen con doble validación.</p></footer>
    </>
  );
}
