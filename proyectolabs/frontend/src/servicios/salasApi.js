const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3010";

async function leerRespuesta(respuesta) {
  const tipo = respuesta.headers.get("content-type") || "";
  return tipo.includes("application/json") ? respuesta.json() : null;
}

export async function obtenerSalas({ signal } = {}) {
  const respuesta = await fetch(`${API_URL}/api/salas`, { signal });
  if (!respuesta.ok) throw new Error("No se pudieron cargar los laboratorios.");
  return leerRespuesta(respuesta);
}

export async function crearReserva(salaId, reserva) {
  const respuesta = await fetch(`${API_URL}/api/salas/${salaId}/reservas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reserva),
  });
  const datos = await leerRespuesta(respuesta);

  if (!respuesta.ok) {
    const error = new Error(datos?.error || datos?.mensaje || "No se pudo crear la reserva.");
    error.status = respuesta.status;
    error.detalles = datos?.detalles;
    throw error;
  }

  return datos;
}
