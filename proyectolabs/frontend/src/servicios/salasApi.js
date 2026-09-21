const URL_BASE_SALAS = "http://localhost:3010/api/salas";

// Pide al backend la lista de laboratorios (salas) con sus reservas incluidas.
export async function obtenerSalas() {
  const respuesta = await fetch(URL_BASE_SALAS);

  if (!respuesta.ok) {
    throw new Error(`No se pudo obtener la lista de laboratorios (código ${respuesta.status}).`);
  }

  return respuesta.json();
}

// Crea una reserva real para una sala existente vía POST /api/salas/:id/reservas.
export async function crearReserva(salaId, datos) {
  const respuesta = await fetch(`${URL_BASE_SALAS}/${salaId}/reservas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });

  const cuerpo = await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    const error = new Error(
      cuerpo?.error || cuerpo?.mensaje || `No se pudo crear la reserva (código ${respuesta.status}).`
    );
    error.status = respuesta.status;
    error.detalles = cuerpo?.detalles;
    throw error;
  }

  return cuerpo;
}
