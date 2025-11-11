import express from "express";
import {
  insertaproducto,
  muestraCategorias,
  muestraproductosId,
  actualizaproducto,
  cambiarStock,
} from "../controladores/productosControladores.js";

const rutas = express.Router();
//eje6
rutas.post("/productos/adi", insertaproducto);
//eje7
rutas.get("/muestraProductos", muestraCategorias);
//eje8
rutas.get("/muestraproductos/:id", muestraproductosId);
//eje9
rutas.put("/producto/:id", actualizaproducto);
//eje10
rutas.patch("/productos/:id/stock", cambiarStock);

export default rutas;
