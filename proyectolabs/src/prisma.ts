// Traemos a nuestro ayudante experto en bases de datos
import { PrismaClient } from '@prisma/client';
// Creamos nuestra herramienta de conexión para poder hablar con la base de datos
export const prisma = new PrismaClient();