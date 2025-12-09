import express from "express";
import {
  muestra,
  muestraCategoria,
  insertaCategoria,
  actualizaCategoria,
  eliminaCategoria,
} from "../controladores/categoriasControlador.js";

const rutas = express.Router();

rutas.get("/muestraCategoria", muestra);
rutas.get("/muestraCategoria/:id", muestraCategoria);
rutas.post("/insertaCategoria/adi", insertaCategoria);
rutas.put("/actualizaCategoria/:id", actualizaCategoria);
rutas.delete("/eliminaCategoria/:id", eliminaCategoria);

export default rutas;
