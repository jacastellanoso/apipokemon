// Importamos la herramienta Router de Express para crear rutas modulares
import { Router } from "express";

// Importamos la función controladora que se encargará del trabajo real
import { getPokemon, getPokemonTipos } from "./controllers/pokemon";

// Creamos la instancia del enrutador
export const router = Router();

// DEFINICIÓN DEL ENDPOINT:
// - Método: GET (para solicitar información)
// - Camino: "/pokemon/:nombre" donde ':nombre' es un parámetro dinámico variable
// - Atendido por: la función 'getPokemon'
router.get("/pokemon/:nombre", getPokemon);
router.get("/pokemon/:nombre/tipos", getPokemonTipos);
