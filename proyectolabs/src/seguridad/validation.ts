// Importamos la herramienta 'zod' que nos sirve para revisar que los datos estén correctos
import { z } from 'zod';

// Creamos un molde para revisar los datos cuando nos pidan crear una sala
export const crearSalaSchema = z.object({
  // El nombre debe ser texto y tener al menos 2 letras para que no esté vacío
  nombre: z.string().min(2, "El nombre es muy cortito."),
  // El edificio debe ser texto y tener al menos 1 letra
  edificio: z.string().min(1, "El edificio es obligatorio."),
  // La capacidad debe ser un número, entero (sin decimales) y positivo (mayor a cero)
  capacidad: z.number().int().positive("La capacidad debe ser mayor a cero.")
});

// Creamos un molde para revisar los datos cuando alguien quiera apartar una sala
export const crearReservaSchema = z.object({
  // El responsable debe ser texto de al menos 3 letras
  responsable: z.string().min(3, "¿Quién reserva?"),
  // El motivo de la reunión debe tener al menos 3 letras
  motivo: z.string().min(3, "Cuenta para qué la van a usar."),
  // 'coerce.date' agarra el texto que nos mandan y lo transforma a un formato de fecha real
  inicio: z.coerce.date(),
  // Lo mismo para la hora en que termina la reserva
  fin: z.coerce.date()
})
// 'refine' nos sirve para poner una regla lógica personalizada. Aquí revisamos que el fin sea después del inicio.
.refine(datos => datos.fin > datos.inicio, {
  // Si la regla falla, mostramos este mensaje
  message: "La hora en que termina tiene que ser después de la hora en que inicia.",
  // Le indicamos al programa que el error está en el dato 'fin'
  path: ["fin"]
})
// Ponemos otra regla lógica: la hora de inicio tiene que ser mayor a la hora actual (new Date())
.refine(datos => datos.inicio > new Date(), {
  // Si intentan reservar en el pasado, mostramos este mensaje
  message: "No puedes viajar al pasado, la reserva debe ser para el futuro.",
  path: ["inicio"]
});

// Este molde solo sirve para revisar que un ID (como el número de la sala) sea siempre un número positivo y sin decimales
export const idSchema = z.coerce.number().int().positive();