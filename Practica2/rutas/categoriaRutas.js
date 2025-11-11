import express from "express";
import {
  insertacategoria,
  muestraCategorias,
  muestracategoriasId,
  actualizaCategoria,
  eliminaCategoria,
} from "../controladores/categoriasControladores.js";

const rutas = express.Router();
//eje1
rutas.post("/categorias/adi", insertacategoria);
//eje2
rutas.get("/muestraCategorias", muestraCategorias);
//eje3
rutas.get("/categoriasID/:id", muestracategoriasId);
//eje4
rutas.put("/categorias/:id", actualizaCategoria);
//eje5
rutas.delete("/categorias/:id", eliminaCategoria);

export default rutas;
