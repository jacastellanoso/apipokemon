import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { crearReserva } from "../../servicios/salasApi.js";
import {
  IconoAdvertencia,
  IconoEdificio,
  IconoExito,
  IconoFin,
  IconoInicio,
  IconoLaboratorio,
  IconoMotivo,
  IconoResponsable,
} from "./iconosDisponibilidad.jsx";
import "./modalReserva.css";

const MENSAJE_HORARIO_OCUPADO =
  "Este laboratorio ya está reservado en el horario seleccionado. Elige otro horario.";

const CAMPOS_INICIALES = { responsable: "", motivo: "", inicio: "", fin: "" };

// Replica en el cliente las mismas reglas que ya exige crearReservaSchema en el backend
// (proyectolabs/src/seguridad/validation.ts), solo para mejorar la experiencia.
// El backend sigue siendo la validación definitiva.
function validarCampos(campos) {
  const errores = {};

  if (campos.responsable.trim().length < 3) errores.responsable = "¿Quién reserva?";
  if (campos.motivo.trim().length < 3) errores.motivo = "Cuenta para qué la van a usar.";

  const fechaInicio = campos.inicio ? new Date(campos.inicio) : null;
  const fechaFin = campos.fin ? new Date(campos.fin) : null;

  if (!fechaInicio || Number.isNaN(fechaInicio.getTime())) {
    errores.inicio = "Indica la fecha y hora de inicio.";
  } else if (fechaInicio <= new Date()) {
    errores.inicio = "No puedes viajar al pasado, la reserva debe ser para el futuro.";
  }

  if (!fechaFin || Number.isNaN(fechaFin.getTime())) {
    errores.fin = "Indica la fecha y hora de finalización.";
  } else if (fechaInicio && fechaFin <= fechaInicio) {
    errores.fin = "La hora en que termina tiene que ser después de la hora en que inicia.";
  }

  return errores;
}

export function ModalReserva({ sala, alCerrar, alExito }) {
  const [campos, setCampos] = useState(CAMPOS_INICIALES);
  const [erroresCampo, setErroresCampo] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState(null);
  const [exito, setExito] = useState(false);
  const primerCampoRef = useRef(null);

  useEffect(() => {
    primerCampoRef.current?.focus();
  }, []);

  useEffect(() => {
    function manejarTecla(evento) {
      if (evento.key === "Escape" && !enviando) alCerrar();
    }
    document.addEventListener("keydown", manejarTecla);
    return () => document.removeEventListener("keydown", manejarTecla);
  }, [enviando, alCerrar]);

  function actualizarCampo(nombre, valor) {
    setCampos((actual) => ({ ...actual, [nombre]: valor }));
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();
    if (enviando) return;

    const erroresValidados = validarCampos(campos);
    setErroresCampo(erroresValidados);
    if (Object.keys(erroresValidados).length > 0) return;

    setEnviando(true);
    setErrorEnvio(null);

    try {
      await crearReserva(sala.id, {
        responsable: campos.responsable.trim(),
        motivo: campos.motivo.trim(),
        inicio: new Date(campos.inicio).toISOString(),
        fin: new Date(campos.fin).toISOString(),
      });

      setExito(true);
      setCampos(CAMPOS_INICIALES);
      setErroresCampo({});
      alExito();
    } catch (err) {
      // 409: el backend detectó un traslape de horario para el mismo laboratorio.
      // No cerramos el modal ni borramos responsable/motivo/inicio/fin: el usuario
      // solo necesita cambiar el horario y reintentar.
      if (err.status === 409) {
        setErrorEnvio(MENSAJE_HORARIO_OCUPADO);
      } else if (err.detalles) {
        const erroresBackend = {};
        for (const campo of Object.keys(err.detalles)) {
          erroresBackend[campo] = err.detalles[campo]?.[0];
        }
        setErroresCampo(erroresBackend);
      } else {
        setErrorEnvio(err.message);
      }
    } finally {
      setEnviando(false);
    }
  }

  function manejarClicFondo(evento) {
    if (evento.target === evento.currentTarget && !enviando) alCerrar();
  }

  function cerrarSiNoEnvia() {
    if (!enviando) alCerrar();
  }

  return createPortal(
    <div className="modal-reserva__fondo" onMouseDown={manejarClicFondo}>
      <div className="modal-reserva" role="dialog" aria-modal="true" aria-labelledby="modal-reserva-titulo">
        <button
          type="button"
          className="modal-reserva__cerrar"
          onClick={cerrarSiNoEnvia}
          aria-label="Cerrar formulario de reserva"
        >
          ×
        </button>

        <div className="modal-reserva__encabezado">
          <span className="modal-reserva__insignia">
            <IconoLaboratorio />
          </span>
          <div>
            <p className="modal-reserva__etiqueta">Reservar laboratorio</p>
            <h3 id="modal-reserva-titulo">{sala.nombre}</h3>
            <p className="modal-reserva__edificio">
              <IconoEdificio /> Edificio {sala.edificio}
            </p>
          </div>
        </div>

        {exito ? (
          <div className="modal-reserva__exito">
            <span className="modal-reserva__exito-icono">
              <IconoExito />
            </span>
            <p>Reserva creada correctamente.</p>
            <button
              type="button"
              className="modal-reserva__boton modal-reserva__boton--primario"
              onClick={alCerrar}
            >
              Cerrar
            </button>
          </div>
        ) : (
          <form className="modal-reserva__formulario" onSubmit={manejarEnvio} noValidate>
            <label className="modal-reserva__campo">
              <span className="modal-reserva__etiqueta-campo">
                <IconoResponsable /> Responsable
              </span>
              <input
                ref={primerCampoRef}
                type="text"
                value={campos.responsable}
                onChange={(evento) => actualizarCampo("responsable", evento.target.value)}
                disabled={enviando}
              />
              {erroresCampo.responsable && (
                <span className="modal-reserva__error">{erroresCampo.responsable}</span>
              )}
            </label>

            <label className="modal-reserva__campo">
              <span className="modal-reserva__etiqueta-campo">
                <IconoMotivo /> Motivo
              </span>
              <input
                type="text"
                value={campos.motivo}
                onChange={(evento) => actualizarCampo("motivo", evento.target.value)}
                disabled={enviando}
              />
              {erroresCampo.motivo && <span className="modal-reserva__error">{erroresCampo.motivo}</span>}
            </label>

            <label className="modal-reserva__campo">
              <span className="modal-reserva__etiqueta-campo">
                <IconoInicio /> Inicio
              </span>
              <input
                type="datetime-local"
                value={campos.inicio}
                onChange={(evento) => actualizarCampo("inicio", evento.target.value)}
                disabled={enviando}
              />
              {erroresCampo.inicio && <span className="modal-reserva__error">{erroresCampo.inicio}</span>}
            </label>

            <label className="modal-reserva__campo">
              <span className="modal-reserva__etiqueta-campo">
                <IconoFin /> Fin
              </span>
              <input
                type="datetime-local"
                value={campos.fin}
                onChange={(evento) => actualizarCampo("fin", evento.target.value)}
                disabled={enviando}
              />
              {erroresCampo.fin && <span className="modal-reserva__error">{erroresCampo.fin}</span>}
            </label>

            {errorEnvio && (
              <p className="modal-reserva__error modal-reserva__error--general">
                <IconoAdvertencia /> {errorEnvio}
              </p>
            )}

            <div className="modal-reserva__acciones">
              <button
                type="button"
                className="modal-reserva__boton"
                onClick={cerrarSiNoEnvia}
                disabled={enviando}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="modal-reserva__boton modal-reserva__boton--primario"
                disabled={enviando}
              >
                {enviando ? "Enviando..." : "Confirmar reserva"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}
