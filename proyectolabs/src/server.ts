import 'dotenv/config';
import express from 'express';
import cors from 'cors';
//import { env } from './env.js';
import { listarSalas, crearSala, crearReserva, borrarSala, actualizarSala } from './salas.controller.js';

const app = express();
const puerto = 3010;

// Le decimos al guardia que deje pasar a las personas
app.use(cors());

// Le enseñamos al edificio a leer paquetes de texto estructurado (JSON)
app.use(express.json());

// Asignamos a cada especialista su ventanilla
app.get('/api/salas', listarSalas);
app.post('/api/salas', crearSala);
app.post('/api/salas/:id/reservas', crearReserva);
app.delete('/api/salas/:id', borrarSala);
app.put('/api/salas/:id', actualizarSala);

// Abrimos las puertas
app.listen(puerto, () => {
  console.log(`¡Nuestra oficina ya está abierta! Escuchando a todos desde la puerta ${puerto}`);
});