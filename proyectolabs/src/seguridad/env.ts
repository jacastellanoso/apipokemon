// Importamos esto para que el programa sepa buscar el archivo .env en la raíz del proyecto
import 'dotenv/config';
// Importamos zod para revisar nuestros enlaces secretos
import { z } from 'zod';

// Creamos una lista de lo que es obligatorio que exista en el archivo .env
const envSchema = z.object({
  // Exigimos que la URL de la base de datos sea un enlace válido de internet (.url())
  DATABASE_URL: z.string().url("Falta la URL de la base de datos o es inválida."),
  // Exigimos lo mismo para la URL de conexión directa
  DIRECT_URL: z.string().url("Falta la URL directa o es inválida."),
  // El puerto lo transformamos a número, entero y positivo. Si no existe en el .env, usa el 3010 por defecto.
  PORT: z.coerce.number().int().positive().default(3010)
});

// Le pedimos a zod que revise (con safeParse) todo lo que encontró en nuestra computadora (process.env)
const revision = envSchema.safeParse(process.env);

// Verificamos si la revisión falló
if (!revision.success) {
  // Imprimimos un error en rojo en la consola para darnos cuenta rápido
  console.error("✕ Configuración inválida. Revisa tu .env:");
  // Imprimimos el detalle exacto de qué fue lo que faltó o estaba mal escrito
  console.error(revision.error.flatten().fieldErrors);
  // Esta línea apaga o mata el programa por completo. Nos sirve para que el servidor no arranque roto o con errores.
  process.exit(1); 
}

// Si la revisión fue exitosa, guardamos los datos ya validados y limpios aquí para poder usarlos en el server.ts
export const env = revision.data;