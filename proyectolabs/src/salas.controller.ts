import type { Request, Response } from 'express';
import { prisma } from './prisma.js';
//import { crearSalaSchema, crearReservaSchema, idSchema } from './validation.js';

// Recepcionista 1: Muestra todas las salas y sus reservas anotadas
export const listarSalas = async (req: Request, res: Response) => {
  try {
    const salas = await prisma.sala.findMany({
      // Aquí le decimos que no solo traiga la sala, sino también su lista de reservas
      include: { reservas: true }
    });
    res.json(salas); // Entregamos la lista completa
  } catch (error) {
    console.error("🚨 Error de Prisma:", error);
    res.status(500).json({ mensaje: 'Ups, no pudimos encontrar las salas.' });
  }
};

// Recepcionista 2: Construye y guarda una nueva sala
export const crearSala = async (req: Request, res: Response) => {
  try {
    const datosDeLaSala = req.body;
    const nuevaSala = await prisma.sala.create({
      data: datosDeLaSala
    });
    res.status(201).json(nuevaSala); // Confirmamos que se creó
  } catch (error) {
    res.status(500).json({ mensaje: 'No pudimos crear la sala.' });
  }
};

// Recepcionista 3: Anota una nueva reserva en el calendario de una sala
export const crearReserva = async (req: Request, res: Response) => {
  try {
    const idDeLaSala = Number(req.params.id); // Vemos en qué sala quieren reservar
    const { responsable, motivo, inicio, fin } = req.body; // Tomamos los datos de la persona

    // Guardamos la hojita de la reserva en el archivero
    const nuevaReserva = await prisma.reserva.create({
      data: {
        responsable: responsable,
        motivo: motivo,
        inicio: new Date(inicio), // Convertimos el texto en un reloj real
        fin: new Date(fin),
        salaId: idDeLaSala // Pegamos la reserva a la sala correcta
      }
    });
    res.status(201).json(nuevaReserva); // Entregamos el comprobante
  } catch (error) {
    res.status(500).json({ mensaje: 'No pudimos guardar la reserva.' });
  }
};

// Recepcionista 4: Tira a la basura una sala que ya no existe
export const borrarSala = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await prisma.sala.delete({
      where: { id: id }
    });
    res.json({ mensaje: 'La sala fue eliminada con éxito.' });
  } catch (error) {
    res.status(500).json({ mensaje: 'No pudimos eliminar esta sala.' });
  }
};

// Recepcionista 5 (El reto extra): Modifica o actualiza una sala existente
export const actualizarSala = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id); // Identificamos qué sala quieren modificar
    const datosNuevos = req.body;     // Vemos cuáles son los datos corregidos
    // Vamos al archivero y aplicamos los cambios
    const salaActualizada = await prisma.sala.update({
      where: { id: id },
      data: datosNuevos
    });
    res.json(salaActualizada); // Devolvemos la sala ya corregida
  } catch (error) {
    console.error("🚨 Error al actualizar:", error);
    res.status(500).json({ mensaje: 'No pudimos actualizar la sala.' });
  }
};