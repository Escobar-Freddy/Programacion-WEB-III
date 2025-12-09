import express from "express";
import {
  muestraProductos,
  muestraProducto,
  insertaProducto,
  actualizaProducto,
  eliminaProducto,
} from "../controladores/productoControlador.js";

const rutas = express.Router();

rutas.get("/muestraProductos", muestraProductos);
rutas.get("/muestraProductos/:id", muestraProducto);
rutas.post("/insertaProductos/adi", insertaProducto);
rutas.put("/actualizaProductos/:id", actualizaProducto);
rutas.delete("/eliminaProductos/:id", eliminaProducto);

export default rutas;
