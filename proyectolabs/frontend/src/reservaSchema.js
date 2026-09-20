import { z } from "zod";

// Replica las reglas del backend para avisar al usuario antes de enviar la petición.
// El backend vuelve a validar porque el navegador nunca es una barrera de seguridad.
export const reservaSchema = z
  .object({
    responsable: z.string().trim().min(3, "¿Quién reserva?"),
    motivo: z.string().trim().min(3, "Cuenta para qué van a usar el lab."),
    inicio: z.coerce.date({ error: "Selecciona una fecha de inicio válida." }),
    fin: z.coerce.date({ error: "Selecciona una fecha de finalización válida." }),
  })
  .refine((reserva) => reserva.fin > reserva.inicio, {
    message: "El fin debe ser después del inicio.",
    path: ["fin"],
  })
  .refine((reserva) => reserva.inicio > new Date(), {
    message: "La reserva debe iniciar en el futuro.",
    path: ["inicio"],
  });
