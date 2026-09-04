// Importamos Express para construir nuestro servidor web
import express from "express";

// Importamos las rutas que definimos en routes.ts
import { router } from "./routes";

// Creamos la aplicación principal de Express
const app = express();

// Definimos el puerto en el que escuchará el servidor (puerto 3001)
const PORT = 3001;

// Ruta raíz con guía interactiva para quien abra localhost:3001
app.get("/", (req, res) => {
  res.json({
    mensaje: "API de Pokémon activa",
    uso: "Consulta un pokémon agregando su nombre a la ruta /api/pokemon/:nombre",
    ejemplo: `http://localhost:${PORT}/api/pokemon/pikachu`,
  });
});


// RUTAS:
// Todas las rutas del router quedan registradas bajo el prefijo "/api".
// Por lo tanto, la dirección completa será: /api/pokemon/:nombre
app.use("/api", router);

// INICIAR EL SERVIDOR:
// Ponemos a escuchar al servidor y mostramos un mensaje en consola confirmando que arrancó
app.listen(PORT, () => {
console.log(` Servidor activo en: http://localhost:${PORT}`);
console.log(` Ejemplo exitoso:  http://localhost:${PORT}/api/pokemon/pikachu`);
console.log(` Ejemplo error 404: http://localhost:${PORT}/api/pokemon/pikachuXYZ`);
});