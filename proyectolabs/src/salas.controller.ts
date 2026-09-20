// Importamos solo los tipos para que TypeScript no marque error de sintaxis estricta
import type { Request, Response } from 'express';
// Importamos nuestro código de conexión a la base de datos
import { prisma } from './prisma.js';
// Importamos las reglas de validación desde la nueva carpeta de seguridad
import { crearSalaSchema, crearReservaSchema, idSchema } from './seguridad/validation.js';

// Función para mostrar todas las salas
export const listarSalas = async (req: Request, res: Response) => {
  try {
    // Buscamos múltiples registros en la tabla sala
    const salas = await prisma.sala.findMany({
      // Le decimos que incluya también la información de la tabla 'reservas' que está conectada a la sala
      include: { reservas: true }
    });
    // Enviamos el resultado al usuario en formato JSON
    res.json(salas);
  } catch (error) {
    // Si algo falla en la base de datos, mostramos el error real en la consola de la computadora
    console.error("🚨 Error de Prisma:", error);
    // Y le enviamos un mensaje de error genérico al usuario (error 500 significa falla interna del servidor)
    res.status(500).json({ mensaje: 'Ups, no pudimos encontrar las salas.' });
  }
};

// Función para agregar una sala nueva
export const crearSala = async (req: Request, res: Response) => {
  // safeParse toma los datos que mandó el usuario (req.body) y los compara con nuestras reglas
  const revision = crearSalaSchema.safeParse(req.body);
  
  // Verificamos si la comparación falló
  if (!revision.success) {
    // Si hay datos malos, devolvemos un código 400 (que significa que el usuario mandó información incorrecta)
    res.status(400).json({
      error: "Datos inválidos",
      // Extraemos el detalle exacto del error para que el usuario sepa qué tiene que arreglar
      detalles: revision.error.flatten().fieldErrors
    });
    // 'return' sirve para salir de la función inmediatamente y que el código de abajo no se ejecute
    return;
  }
  
  // Si los datos pasaron la revisión, usamos los datos limpios (revision.data) para crear el registro en Supabase
  const nuevaSala = await prisma.sala.create({
    data: revision.data
  });
  // Devolvemos un código 201 (que significa 'creado con éxito') junto con la sala que se acaba de crear
  res.status(201).json(nuevaSala);
};

// Función para anotar una nueva reserva en una sala
export const crearReserva = async (req: Request, res: Response) => {
  // Primero revisamos que el número (ID) de la sala que viene en la URL sea un número real y no letras
  const revisionId = idSchema.safeParse(req.params.id);
  
  // Si no es un número válido
  if (!revisionId.success) {
    // Devolvemos error 400
    res.status(400).json({ error: "ID de sala inválido" });
    return;
  }
  
  // Luego revisamos la información enviada (fechas, motivo, responsable)
  const revisionReserva = crearReservaSchema.safeParse(req.body);
  
  // Si los datos no cumplen con las reglas
  if (!revisionReserva.success) {
    // Devolvemos el error detallado
    res.status(400).json({
      error: "Datos de reserva inválidos",
      detalles: revisionReserva.error.flatten().fieldErrors
    });
    return;
  }
  
  // Antes de guardar la reserva, vamos a buscar si la sala realmente existe en la base de datos
  const salaExistente = await prisma.sala.findUnique({ 
    // Buscamos usando el ID que ya fue limpiado por Zod (revisionId.data)
    where: { id: revisionId.data } 
  });
  
  // Si la búsqueda no devuelve nada porque la sala no existe
  if (!salaExistente) {
    // Devolvemos un error 404 que significa 'No encontrado'
    res.status(404).json({ error: "Esa sala no existe" });
    return;
  }

  // Si llegamos hasta aquí, todo está perfecto. Creamos el registro de la reserva.
  const nuevaReserva = await prisma.reserva.create({
    data: {
      // Copiamos toda la información validada de la reserva (responsable, motivo, inicio, fin)
      ...revisionReserva.data,
      // Le adjuntamos el ID de la sala a la que pertenece esta reserva
      salaId: revisionId.data
    }
  });
  
  // Entregamos la reserva recién creada
  res.status(201).json(nuevaReserva);
};

// Función para modificar los datos de una sala que ya existe
export const actualizarSala = async (req: Request, res: Response) => {
  try {
    // Extraemos el número de sala de la URL
    const id = Number(req.params.id); 
    // Extraemos la información nueva que nos enviaron
    const datosNuevos = req.body;     

    // Le pedimos a la base de datos que busque esa sala por su ID y reemplace su contenido
    const salaActualizada = await prisma.sala.update({
      where: { id: id },
      data: datosNuevos
    });

    // Entregamos la información ya actualizada
    res.json(salaActualizada); 
  } catch (error) {
    // Si hay un fallo, lo imprimimos en consola
    console.error("🚨 Error al actualizar:", error);
    res.status(500).json({ mensaje: 'No pudimos actualizar la sala.' });
  }
};

// Función para eliminar un registro completo
export const borrarSala = async (req: Request, res: Response) => {
  try {
    // Obtenemos el número de sala a borrar
    const id = Number(req.params.id);
    
    // Ordenamos a la base de datos que elimine el registro con ese número exacto
    await prisma.sala.delete({
      where: { id: id }
    });
    
    // Entregamos un mensaje para confirmar que se eliminó
    res.json({ mensaje: 'La sala fue eliminada con éxito.' });
  } catch (error) {
    res.status(500).json({ mensaje: 'No pudimos eliminar esta sala.' });
  }
};