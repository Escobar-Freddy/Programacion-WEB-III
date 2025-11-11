import express from "express";
import {
  insertacategoria,
  muestraCategorias,
  muestracategoriasId,
  actualizaCategoria,
  eliminaCategoria,
} from "../controladores/categoriasControladores.js";

const rutas = express.Router();

rutas.post("/categorias/adi", insertacategoria);
rutas.get("/muestraCategorias", muestraCategorias);
rutas.get("/categoriasID/:id", muestracategoriasId);
rutas.put("/categorias/:id", actualizaCategoria);
rutas.delete("/categorias/:id", eliminaCategoria);

export default rutas;
