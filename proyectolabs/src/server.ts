// Importamos la herramienta principal que crea y gestiona nuestro servidor
import express from 'express';
// Importamos cors para permitir que una página web externa pueda conectarse a nuestra API sin ser bloqueada
import cors from 'cors';
// Importamos la configuración validada desde la nueva carpeta de seguridad
import { env } from './seguridad/env.js';
// Importamos las funciones lógicas que programamos en el controlador
import { listarSalas, crearSala, crearReserva, borrarSala, actualizarSala } from './salas.controller.js';

// Inicializamos la aplicación de Express y la guardamos en la variable 'app'
const app = express();

// Activamos cors para evitar bloqueos de seguridad en el navegador del usuario final
app.use(cors());
// Le indicamos a Express que toda la información que reciba o envíe debe procesarse automáticamente a formato JSON
app.use(express.json());

// Configuramos la ruta para obtener la lista de salas usando el método GET
app.get('/api/salas', listarSalas);
// Configuramos la ruta para recibir información y crear una sala usando el método POST
app.post('/api/salas', crearSala);
// Configuramos una ruta que incluye una variable en la URL (:id) para crear una reserva dentro de una sala
app.post('/api/salas/:id/reservas', crearReserva);
// Configuramos la ruta para modificar una sala existente usando el método PUT
app.put('/api/salas/:id', actualizarSala);
// Configuramos la ruta para eliminar una sala existente usando el método DELETE
app.delete('/api/salas/:id', borrarSala);

// Encendemos el servidor y le decimos que espere conexiones en el puerto seguro
app.listen(env.PORT, () => {
  // Imprimimos un mensaje de confirmación para saber que el servidor no falló al arrancar
  console.log(`API lista en http://localhost:${env.PORT}`);
});