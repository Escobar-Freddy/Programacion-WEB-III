import express from "express";
import {
  insertaproducto,
  muestraCategorias,
  muestraproductosId,
  actualizaproducto,
  cambiarStock,
} from "../controladores/productosControladores.js";

const rutas = express.Router();

rutas.post("/productos/adi", insertaproducto);
rutas.get("/muestraProductos", muestraCategorias);
rutas.get("/muestraproductos/:id", muestraproductosId);
rutas.put("/producto/:id", actualizaproducto);
rutas.patch("/productos/:id/stock", cambiarStock);

export default rutas;
